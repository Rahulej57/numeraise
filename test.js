fetch('http://localhost:3000').then(r=>r.text()).then(t=>{
  const match = t.match(/<link[^>]*rel="canonical"[^>]*>/i);
  console.log(match ? match[0] : 'NO CANONICAL TAG FOUND');
});
