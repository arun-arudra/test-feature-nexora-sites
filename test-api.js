const http = require('http');

async function testFetch() {
  console.time('Supabase Check');
  try {
    const res = await fetch("https://unznsmoxslelsizcgppi.supabase.co");
    console.log("Supabase status:", res.status);
  } catch (e) {
    console.log("Supabase error:", e.message);
  }
  console.timeEnd('Supabase Check');

  console.time('Contentful Check');
  try {
    const res2 = await fetch("https://cdn.contentful.com");
    console.log("Contentful status:", res2.status);
  } catch (e) {
    console.log("Contentful error:", e.message);
  }
  console.timeEnd('Contentful Check');
}

testFetch();
