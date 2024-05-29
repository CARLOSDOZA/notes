import { ReactNode, useRef } from 'react';

type ToolTipProps = {
  children: ReactNode;
  tooltip?: string;
};

export default function ToolTipComponent({ children, tooltip }: ToolTipProps) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();

        tooltipRef.current.style.left = clientX - left + 'px';
      }}
      className="group relative inline-block"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-slate-500 text-white text-xs py-0.5 px-1 absolute top-full mt-2 whitespace-nowrap rounded"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
}
