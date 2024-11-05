"use client";

import { motion, useInView } from "framer-motion";
import { withStaggeredFadeIn } from "@/lib/animations";
import { HTMLMotionProps } from "framer-motion";
import { useRef } from "react";

interface AnimatedElementProps extends HTMLMotionProps<"div"> {
    index?: number;
    as?:
        | "div"
        | "span"
        | "p"
        | "section"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";
    threshold?: number;
}

export function AnimatedElement({
    children,
    index = 0,
    as = "div",
    threshold = 0.2,
    ...props
}: AnimatedElementProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        amount: threshold,
    });

    const MotionTag = motion[as] as any;

    return (
        <MotionTag
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
            }}
            {...props}
        >
            {children}
        </MotionTag>
    );
}
