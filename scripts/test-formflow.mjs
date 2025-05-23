import { FormFlowClient } from '../app/lib/formflow-client.js';

async function testFormFlowIntegration() {
  console.log('Testing FormFlow integration...');
  
  const credentials = {
    clientId: 'eN7muAV231',
    clientSecret: 'KrHYJbsf4DXG1g86p2MGjM6v3nV15FSa',
    organizationId: 'org_2nHy8pbeoD5CM9WbjvyGj1VKoUu'
  };

  try {
    const client = new FormFlowClient(credentials);
    console.log('✅ FormFlow client created successfully');

    // Test authentication by trying to list templates
    console.log('🔑 Testing authentication...');
    const templates = await client.get('/api/template');
    console.log('✅ Authentication successful!');
    console.log('📋 Available templates:', JSON.stringify(templates, null, 2));

  } catch (error) {
    console.error('❌ Error testing FormFlow:', error.message);
    process.exit(1);
  }
}

testFormFlowIntegration();