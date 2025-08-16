import { createClient } from '@supabase/supabase-js';
import cheeseData from '../assets/data/cheese_dataset_seed.json';

// Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'your_supabase_url';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CheeseSeed {
  id: string;
  name: string;
  producer: string;
  country: string;
  region: string;
  milkType: string;
  maturation: string;
  flavorProfile: string[];
  pairings: string[];
  photoUrl: string;
  avgRating: number;
  reviewCount: number;
  designation?: string;
}

async function seedCheeses() {
  console.log('🚀 Starting cheese data import...');
  
  try {
    // Transform data to match database schema
    const cheeses = cheeseData.map((cheese: CheeseSeed) => ({
      id: cheese.id,
      name: cheese.name,
      producer: cheese.producer,
      country: cheese.country,
      region: cheese.region,
      milk_type: cheese.milkType,
      maturation: cheese.maturation,
      flavor_profile: cheese.flavorProfile,
      pairings: cheese.pairings,
      designation: cheese.designation || null,
    }));

    console.log(`📊 Importing ${cheeses.length} cheeses...`);

    // Insert cheeses in batches to avoid rate limits
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < cheeses.length; i += batchSize) {
      const batch = cheeses.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('cheeses')
        .upsert(batch, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`❌ Error importing batch ${Math.floor(i / batchSize) + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} imported successfully`);
        successCount += data?.length || 0;
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📈 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} cheeses`);
    console.log(`❌ Failed imports: ${errorCount} cheeses`);
    console.log(`📊 Total processed: ${cheeses.length} cheeses`);

    // Verify import
    const { data: verifyData, error: verifyError } = await supabase
      .from('cheeses')
      .select('id, name')
      .limit(5);

    if (verifyError) {
      console.error('❌ Error verifying import:', verifyError);
    } else {
      console.log('\n🔍 Sample imported cheeses:');
      verifyData?.forEach(cheese => {
        console.log(`  - ${cheese.name} (${cheese.id})`);
      });
    }

  } catch (error) {
    console.error('💥 Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the import
if (require.main === module) {
  seedCheeses()
    .then(() => {
      console.log('\n🎉 Cheese import completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Import failed:', error);
      process.exit(1);
    });
}

export { seedCheeses };
