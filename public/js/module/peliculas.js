let res = await fetch(`${location.href}/v1`)

document.querySelector("pre").innerHTML = JSON.stringify(await res.json(), null, 4) 
