import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import QRCode from "./components/qrcode";
import { QRCodeRenderersOptions } from "qrcode";

function App() {
  const [content, setContent] = createSignal("");

  const [windowSize, setWindowSize] = createSignal({
    height: window.visualViewport?.height ?? window.innerHeight,
    width: window.visualViewport?.width ?? window.innerWidth,
  });

  const qrOptions = createMemo(() => {
    // Minimum width is 512
    const width = Math.max(Math.min(windowSize().height, windowSize().width) * 0.7, 512);
    return {
      width,
    } as QRCodeRenderersOptions;
  });

  const handler = () => {
    console.log('handler');
    setWindowSize({ height: visualViewport?.height ?? window.innerHeight, width: window.visualViewport?.width ?? window.innerWidth });
  };

  onMount(() => {
    window.addEventListener("resize", handler);
    visualViewport?.addEventListener("resize", handler);
  });

  onCleanup(() => {
    window.removeEventListener("resize", handler);
    visualViewport?.removeEventListener("resize", handler);
  });

  return (
    <div class="py-4 flex flex-col items-center">
      <div class="w-full lg:w-8/12">
          <div class="text-3xl mb-4">Generate a QR Code</div>
          <div class="form-control w-full mb-4">
            <input
              type="text"
              placeholder="Url or content"
              class="input input-bordered input-primary w-full"
              value={content()}
              onInput={(v) => setContent(v.target.value)}
            />
          </div>
          <div class="flex justify-center">
            <QRCode content={content} options={qrOptions}></QRCode>
          </div>
      </div>
    </div>
  );
}

export default App;
