/**
 * Test Character Limit Validation
 * Tests folder (300 chars) and article (200 chars) validation
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function testValidation() {
  const baseUrl = 'http://localhost:3000';
  const apiKey = process.env.LIBRARY_API_KEY;

  if (!apiKey) {
    console.error('❌ LIBRARY_API_KEY not found in environment');
    return;
  }

  console.log('🧪 Testing Character Limit Validation\n');

  // Test 1: Folder with exactly 300 characters (should pass)
  console.log('Test 1: Folder with 300 characters (boundary - should PASS)');
  const desc300 = 'a'.repeat(300);
  console.log(`Description length: ${desc300.length}`);

  try {
    const res1 = await fetch(`${baseUrl}/api/library/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: 'Test Folder 300',
        slug: 'test-folder-300',
        description: desc300
      })
    });
    const data1 = await res1.json();
    console.log(`Status: ${res1.status}`);
    console.log(`Response:`, data1);
    console.log(res1.ok ? '✅ PASSED\n' : '❌ FAILED\n');
  } catch (error) {
    console.error('❌ Request failed:', error);
  }

  // Test 2: Folder with 301 characters (should fail)
  console.log('Test 2: Folder with 301 characters (over limit - should FAIL)');
  const desc301 = 'a'.repeat(301);
  console.log(`Description length: ${desc301.length}`);

  try {
    const res2 = await fetch(`${baseUrl}/api/library/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: 'Test Folder 301',
        slug: 'test-folder-301',
        description: desc301
      })
    });
    const data2 = await res2.json();
    console.log(`Status: ${res2.status}`);
    console.log(`Response:`, data2);
    console.log(res2.status === 400 ? '✅ PASSED (rejected correctly)\n' : '❌ FAILED\n');
  } catch (error) {
    console.error('❌ Request failed:', error);
  }

  // Test 3: Folder with whitespace-only description (should fail - CRITICAL-04)
  console.log('Test 3: Folder with whitespace-only description (should FAIL - CRITICAL-04)');

  try {
    const res3 = await fetch(`${baseUrl}/api/library/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: 'Test Folder Whitespace',
        slug: 'test-folder-whitespace',
        description: '   \n\t   '
      })
    });
    const data3 = await res3.json();
    console.log(`Status: ${res3.status}`);
    console.log(`Response:`, data3);
    console.log(res3.status === 400 && data3.error.includes('empty or whitespace-only') ? '✅ PASSED (rejected correctly)\n' : '❌ FAILED\n');
  } catch (error) {
    console.error('❌ Request failed:', error);
  }

  // Test 4: Article with exactly 200 characters (should pass)
  console.log('Test 4: Article with 200 characters (boundary - should PASS)');
  const articleDesc200 = 'b'.repeat(200);
  console.log(`Description length: ${articleDesc200.length}`);

  try {
    // First, we need a folder ID - using the Business Analysis Masterclass folder
    const folderId = 'KzxINEBTTc9KcM2WzGWB';

    const res4 = await fetch(`${baseUrl}/api/library/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        title: 'Test Article 200',
        slug: 'test-article-200',
        folderId: folderId,
        content: 'Test content for validation',
        description: articleDesc200
      })
    });
    const data4 = await res4.json();
    console.log(`Status: ${res4.status}`);
    console.log(`Response:`, data4);
    console.log(res4.ok ? '✅ PASSED\n' : '❌ FAILED\n');
  } catch (error) {
    console.error('❌ Request failed:', error);
  }

  // Test 5: Article with 201 characters (should fail)
  console.log('Test 5: Article with 201 characters (over limit - should FAIL)');
  const articleDesc201 = 'b'.repeat(201);
  console.log(`Description length: ${articleDesc201.length}`);

  try {
    const folderId = 'KzxINEBTTc9KcM2WzGWB';

    const res5 = await fetch(`${baseUrl}/api/library/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        title: 'Test Article 201',
        slug: 'test-article-201',
        folderId: folderId,
        content: 'Test content for validation',
        description: articleDesc201
      })
    });
    const data5 = await res5.json();
    console.log(`Status: ${res5.status}`);
    console.log(`Response:`, data5);
    console.log(res5.status === 400 ? '✅ PASSED (rejected correctly)\n' : '❌ FAILED\n');
  } catch (error) {
    console.error('❌ Request failed:', error);
  }

  console.log('✅ Validation testing complete!');
}

testValidation().catch(console.error);
