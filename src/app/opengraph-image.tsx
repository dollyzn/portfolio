import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} - ${site.role}`;

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), "public", "logo-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#02040A",
        padding: 80,
        position: "relative",
      }}
    >
      {/* satori não renderiza radial-gradient com fidelidade; usamos camadas lineares */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          background:
            "linear-gradient(115deg, #02040A 46%, #040E2C 74%, #0A2472 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "linear-gradient(90deg, #2563EB, #4CB1FC, #72DEFE)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img src={markSrc} alt="" width={41} height={64} />
        <div style={{ color: "#7F8FA8", fontSize: 22, letterSpacing: 4 }}>
          PORTFÓLIO
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#EEF3FB",
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 22,
            color: "#4CB1FC",
            fontSize: 30,
            letterSpacing: 1,
          }}
        >
          {site.role}
        </div>
        <div style={{ marginTop: 12, color: "#7F8FA8", fontSize: 26 }}>
          React · Node.js · TypeScript
        </div>
      </div>

      <div style={{ display: "flex", color: "#5A6880", fontSize: 22 }}>
        {site.location}
      </div>
    </div>,
    size,
  );
}
