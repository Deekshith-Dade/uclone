Number.prototype.round = function(places) {
  return +(Math.round(`${this}e+${places}e-${places}`));
}


export const wait = (t) => new Promise((res) => {
  setTimeout(()=>{
    res();
  }, t);
});
