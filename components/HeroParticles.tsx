"use client";
import { useEffect, useRef } from "react";

export default function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;
    const container = containerRef.current;
    if (!container) return;

    import("three").then((THREE) => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 9;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const N = window.innerWidth < 768 ? 700 : 1600;
      const positions = new Float32Array(N * 3);
      const colorsArr = new Float32Array(N * 3);
      const palette = [
        new THREE.Color("#ec4899"), new THREE.Color("#f9a8d4"),
        new THREE.Color("#be185d"), new THREE.Color("#ffffff"),
        new THREE.Color("#fce7f3"), new THREE.Color("#831843"),
      ];
      for (let i = 0; i < N; i++) {
        positions[i*3]   = (Math.random()-0.5)*22;
        positions[i*3+1] = (Math.random()-0.5)*14;
        positions[i*3+2] = (Math.random()-0.5)*10;
        const c = palette[Math.floor(Math.random()*palette.length)];
        colorsArr[i*3]=c.r; colorsArr[i*3+1]=c.g; colorsArr[i*3+2]=c.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(colorsArr, 3));
      const mat = new THREE.PointsMaterial({
        size:0.07, vertexColors:true, transparent:true, opacity:0.65,
        blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const dGeo = new THREE.OctahedronGeometry(0.12, 0);
      const diamonds = Array.from({ length: 14 }, () => {
        const m = new THREE.Mesh(dGeo, new THREE.MeshBasicMaterial({
          color: new THREE.Color("#ec4899"), transparent:true, opacity:0.3, wireframe:true,
        }));
        m.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*12,(Math.random()-0.5)*6);
        m.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
        scene.add(m); return m;
      });

      const ringGeo = new THREE.TorusGeometry(3.5, 0.012, 6, 120);
      const ringMat = new THREE.MeshBasicMaterial({ color:new THREE.Color("#ec4899"), transparent:true, opacity:0.18 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI/3;
      scene.add(ring);

      let mx=0, my=0;
      const onMove = (e: MouseEvent) => {
        mx = e.clientX/window.innerWidth-0.5;
        my = -(e.clientY/window.innerHeight-0.5);
      };
      window.addEventListener("mousemove", onMove);

      let t=0;
      const tick = () => {
        animId = requestAnimationFrame(tick);
        t+=0.004;
        points.rotation.y = t*0.06+mx*0.4;
        points.rotation.x = t*0.02+my*0.25;
        points.scale.setScalar(1+Math.sin(t*0.4)*0.025);
        diamonds.forEach((d,i) => {
          d.rotation.x+=0.003+i*0.0003;
          d.rotation.y+=0.005+i*0.0002;
          d.position.y+=Math.sin(t*0.8+i)*0.003;
        });
        ring.rotation.z = t*0.04+mx*0.15;
        ring.rotation.x = Math.PI/3+my*0.1;
        renderer.render(scene, camera);
      };
      tick();

      const onResize = () => {
        const w2=window.innerWidth, h2=window.innerHeight;
        camera.aspect=w2/h2; camera.updateProjectionMatrix();
        renderer.setSize(w2,h2);
      };
      window.addEventListener("resize", onResize);

      const ref = containerRef as React.MutableRefObject<HTMLDivElement & { _cleanup?: ()=>void }>;
      ref.current!._cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        geo.dispose(); mat.dispose(); dGeo.dispose(); ringGeo.dispose(); ringMat.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelAnimationFrame(animId);
      const el = containerRef.current as (HTMLDivElement & { _cleanup?: ()=>void }) | null;
      el?._cleanup?.();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex:3 }} />;
}
