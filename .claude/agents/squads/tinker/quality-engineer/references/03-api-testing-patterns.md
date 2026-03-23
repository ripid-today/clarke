# API Testing Patterns — TII Quality Engineer Reference

## Scope 3: API / Route Handler Testing

Verify Route Handlers return correct HTTP status codes, response schemas, and reject invalid input.

---

## Current TII API Routes

As of March 2026, TII has no Route Handlers — all data access is via Server Components calling Firestore directly. When Route Handlers are added, test them using the patterns below. Update this file with the route inventory.

**When a new Route Handler is added:** File is at `app/api/[route-name]/route.ts`. Test locally at `http://localhost:3000/api/[route-name]`.

---

## Testing a GET Route Handler

```bash
# Start the dev server first:
cd projects/the-intelligent-investor
npm run dev

# Basic GET — success case
curl -s "http://localhost:3000/api/articles?folderId=abc123" | python3 -m json.tool

# Expected success response:
# HTTP 200
# {"data": {"articles": [...]}}

# Missing required param — 400
curl -s -w "\nHTTP Status: %{http_code}\n" "http://localhost:3000/api/articles"
# Expected: HTTP 400
# {"error": "folderId is required"}

# Non-existent resource — 404
curl -s -w "\nHTTP Status: %{http_code}\n" "http://localhost:3000/api/articles/nonexistent-id"
# Expected: HTTP 404
# {"error": "Article not found"}
```

## Testing a POST Route Handler

```bash
# Valid POST — 201 Created
curl -s -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -d '{
    "title": "Test Article",
    "folderId": "valid-folder-id",
    "content": "Test content...",
    "description": "Test description",
    "status": "draft"
  }'
# Expected: HTTP 201
# {"data": {"id": "auto-generated-id"}}

# Missing required field — 400
curl -s -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -d '{"title": "Test"}'
# Expected: HTTP 400
# {"error": "folderId is required"}

# Invalid JSON — 400
curl -s -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -d 'not valid json'
# Expected: HTTP 400
# {"error": "Invalid JSON body"}

# Field too long — 400
curl -s -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -d '{"title": "'"$(python3 -c "print('a' * 201)")"'", "folderId": "abc"}'
# Expected: HTTP 400
# {"error": "title must be 200 characters or less"}

# Unexpected field — 400
curl -s -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -d '{"title": "Test", "folderId": "abc", "hackerField": "malicious"}'
# Expected: HTTP 400
# {"error": "Unexpected fields: hackerField"}
```

---

## Expected HTTP Status Code Table

| Scenario | Expected Code |
|---------|--------------|
| Successful GET | 200 |
| Successful POST (created) | 201 |
| Successful POST (updated) | 200 |
| Missing required field | 400 |
| Invalid field type | 400 |
| Field exceeds length limit | 400 |
| Invalid format (slug, enum) | 400 |
| Unexpected/unlisted field | 400 |
| Invalid JSON body | 400 |
| Resource not found | 404 |
| Unhandled HTTP method | 405 |
| Firebase/Firestore failure | 500 |
| Firestore quota exceeded | 503 (or 500 if not differentiated) |

---

## Response Schema Validation

For every Route Handler, verify the response shape:

**Success shape:**
```json
{
  "data": {
    "[resource]": "..."
  }
}
```

**Error shape:**
```json
{
  "error": "Descriptive message"
}
```

**Schema checks to perform:**
- [ ] Response body is valid JSON (not HTML error page)
- [ ] Success responses have a `data` key, not direct fields
- [ ] Error responses have an `error` key with a string value (not an object)
- [ ] No `stack`, `code`, or internal error metadata in the response body
- [ ] `Content-Type: application/json` header is set in response

---

## Security Validation for API Responses

**Critical checks — block deployment if any fail:**

1. **No secret values in response body:**
```bash
curl -s "http://localhost:3000/api/articles" | grep -i "privateKey\|clientEmail\|ANTHROPIC\|firebase_admin"
# Should return 0 results
```

2. **No admin credentials exposed:**
```bash
curl -s "http://localhost:3000/api/articles" | grep -i "BEGIN RSA\|BEGIN PRIVATE"
# Should return 0 results
```

3. **No Firestore error details leaked in 500 responses:**
Trigger a 500 by temporarily breaking the Firestore connection. Verify the response is:
```json
{"error": "Internal server error"}
```
NOT:
```json
{"error": "PERMISSION_DENIED: Cloud Firestore API has not been used..."}
```

4. **HTTP method enforcement:**
```bash
# If only GET is implemented, verify POST is rejected
curl -s -X POST "http://localhost:3000/api/articles-readonly" -w "\nHTTP: %{http_code}\n"
# Expected: HTTP 405
```

---

## Testing Validation Error Messages

Error messages must be specific enough for API consumers to fix the problem without reading source code:

| Message quality | Example | Assessment |
|----------------|---------|------------|
| Too vague | "Invalid input" | Fail — consumer cannot identify which field |
| Specific | "title must be 200 characters or less" | Pass |
| Revealing internal details | "Firestore write failed at FIREBASE_ADMIN..." | Fail — leaks internal info |
| Specifying the field and rule | "folderId is required" | Pass |

---

## Testing Edge Cases

### Empty Collection
When Firestore has no documents matching the query:
```bash
curl -s "http://localhost:3000/api/articles?folderId=empty-folder"
# Expected: HTTP 200 (not 404)
# {"data": {"articles": []}}
```

### Large Page Count
```bash
curl -s "http://localhost:3000/api/articles?folderId=abc&limit=1000"
# Expected: HTTP 200 with max configured limit applied
# NOT 1000 records (enforce max pagination limit server-side)
```

### SQL/NoSQL Injection Attempt
```bash
curl -s "http://localhost:3000/api/articles?folderId='; DROP TABLE articles; --"
# Expected: HTTP 200 or 404 (Firestore is not SQL; this string is just treated as a literal ID)
# The key check: no data corruption occurred
```

---

## TII-Specific Integration: API → Firestore

When a Route Handler creates an article, verify the Firestore write:

1. Call `POST /api/articles` with valid payload
2. Note the returned `id` from response
3. Query Firestore directly: `adminDb.collection("articles").doc(returnedId).get()`
4. Verify all fields written match the request payload
5. Verify `createdAt` and `updatedAt` are recent Firestore Timestamps
6. Verify `id` field in document matches the document ID

---

## Load Testing (Optional, Pre-Launch)

For major releases, test the homepage under concurrent requests:
```bash
# Using Apache Bench (ab) — 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/

# Check response:
# - No 5xx errors
# - P95 response time < 3000ms (Next.js force-dynamic + Firestore)
# - No memory leaks after load test
```

TII's homepage is `force-dynamic` (no Next.js caching). Firestore reads are relatively fast (~100-300ms) so 10 concurrent is a conservative baseline.
