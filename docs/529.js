(()=>{const e=e=>(e^=e<<13,e>>>=0,e^=e>>>17,(e^=e<<15)>>>0),n=({seed:e,rateCumSum:n})=>{const r=e%1e4;return n.findIndex((e=>r<e))},r=({seed:e,rarity:n,bannerUnits:r,removedIndex:s=-1})=>{const t=r[n];let a;return-1===s?a=e%t.length:(a=e%(t.length-1),a>=s&&a++),[a,t[a]]},s=({seed:s,rolls:t,bannerRateCumSum:a,bannerUnits:o,bannerRerollablePools:l})=>{let d=-1;for(const u of t){s=e(s);const t=n({seed:s,rateCumSum:a});s=e(s);const[b,i]=r({seed:s,rarity:t,bannerUnits:o});if(i===d&&l.includes(t)){s=e(s);const[n,a]=r({seed:s,rarity:t,bannerUnits:o,removedIndex:b});if(u!==a)return!1;d=a}else{if(u!==i)return!1;d=i}}return!0};onmessage=e=>{(e=>{const{workerNumber:n,startSeed:r,endSeed:t,rolls:a,bannerRateCumSum:o,bannerUnits:l,bannerRerollablePools:d}=e,u=(t-r)/10;let b=0,i=r+u;for(let e=r;e<t;e++)e>=i&&(b+=10,postMessage({type:"progress",percentageSearched:b}),i+=u),s({seed:e,rolls:a,bannerRateCumSum:o,bannerUnits:l,bannerRerollablePools:d})&&postMessage({type:"seedFound",seed:e})})(e.data),postMessage({type:"progress",percentageSearched:100})}})();