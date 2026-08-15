"use client";

import { useEffect } from "react";

export function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "%c👋 oh, you're actually looking in here",
      "font-size: 18px; font-weight: bold; color: #4c8dff;"
    );
    console.log(
      "%cI'm Ankit. I built this site, the 3D graph you scrolled past, and yes - the console message you weren't supposed to need to read.",
      "font-size: 13px; color: #8b9198; line-height: 1.5;"
    );
    console.log(
      "%cIf you're checking the console instead of the About page, you're clearly the kind of person I'd like to talk to. ank12it11@gmail.com - or hit Cmd+K on the site and see what happens.",
      "font-size: 13px; color: #4c8dff; line-height: 1.5;"
    );
  }, []);

  return null;
}