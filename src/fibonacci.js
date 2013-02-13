
this.onmessage = function(event) {
  var n = parseInt(event.data);
  postMessage({result:fibonacci(n)});
}


function fibonacci(n) {
  if(n == 0)
    return 0;
  if(n == 1)
    return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
