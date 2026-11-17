// Smooth scrolling (Locomotive Scroll) kept in sync with GSAP ScrollTrigger.
function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },

    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
locomotive();

// Canvas that shows the character frames.
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
sizeCanvas();

window.addEventListener("resize", function () {
  sizeCanvas();
  render();
});

// Frames are named 0001.png ... 0300.png.
const frameCount = 300;

function framePath(index) {
  return `./${String(index + 1).padStart(4, "0")}.png`;
}

const images = [];
const imageSeq = {
  frame: 0,
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = framePath(i);
  images.push(img);
}

// Scroll progress -> frame number.
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.15,
    trigger: ".section1>canvas",
    start: "top top",
    end: "600% top",
    scroller: "#main",
  },
  onUpdate: render,
});

images[0].onload = render;

function render() {
  const img = images[imageSeq.frame];
  // 0292.png is missing from the frame set, so skip any frame that failed to
  // load and keep the previous one on screen.
  if (!img || !img.complete || img.naturalWidth === 0) return;
  scaleImage(img, context);
}

// Draw the image so it covers the whole canvas, cropping the overflow.
function scaleImage(img, ctx) {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShiftX = (canvas.width - img.width * ratio) / 2;
  const centerShiftY = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShiftX,
    centerShiftY,
    img.width * ratio,
    img.height * ratio
  );
}

// Keep the canvas pinned while the frames play.
ScrollTrigger.create({
  trigger: ".section1>canvas",
  pin: true,
  scroller: "#main",
  start: "top top",
  end: "600% top",
});

// Pin each text section for one screen of scrolling.
[".section2", ".section3", ".section4"].forEach((selector) => {
  ScrollTrigger.create({
    trigger: selector,
    start: "top top",
    end: "bottom top",
    pin: true,
    scroller: "#main",
  });
});
