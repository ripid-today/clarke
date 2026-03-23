# MEMORY — Quality-Engineer

## Index
| File | Keywords | Summary |
|------|----------|---------|
| `patterns.md` | test, validation, QA, approach, caught, bug, confirmed, scope, pass | Validated QA approaches and test patterns that caught real bugs |
| `corrections.md` | miss, false approval, wrong, overlooked, regression, approved, broke | Past QA misses and false approvals to avoid |
| `known-issues.md` | recurring, regression, known, limitation, workaround, issue, bug, watch | Recurring TII bugs and known limitations to check on every QA cycle |

## Protocol
- Read all three files at the start of every quality-engineer invocation
- patterns.md updated when a new test approach is confirmed to catch real issues
- corrections.md updated when a false approval or missed bug is discovered post-deployment
- known-issues.md updated every time a recurring bug is found or fixed
- Never delete entries from corrections.md or known-issues.md — mark fixed with [FIXED in date/PR]
- Max 200 lines in this index file
