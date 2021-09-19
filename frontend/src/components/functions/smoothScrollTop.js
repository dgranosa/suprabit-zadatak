let globLastC = Infinity;

function smoothScrollTopRec() {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0 && globLastC > c) {
    globLastC = c;
    window.requestAnimationFrame(smoothScrollTopRec);
    window.scrollTo(0, c - c / 8);
  } else {
    globLastC = Infinity;
  }
}

function smoothScrollTop() {
  /**
   * Normally this gets called from componentDidMount()
   * Not waiting a tiny fraction of time can lead
   * to shaky behaviour
   */
  setTimeout(() => {
    smoothScrollTopRec();
  }, 10);
}

export default smoothScrollTop;