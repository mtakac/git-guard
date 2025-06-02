"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type UserNameProps = {
  name: string;
};

export default function UserName({ name }: UserNameProps) {
  const userNameRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(".user-name", {
        x: 400,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: userNameRef, dependencies: [name] }
  );

  return (
    <div ref={userNameRef}>
      <h2 className="user-name scroll-m-20 mb-6 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {name}
      </h2>
    </div>
  );
}
