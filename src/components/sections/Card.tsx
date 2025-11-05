import { CometCard } from "../ui/comet-card";

export function Card({ image }: {image:string;}) {
  return (
    <CometCard className="overflow-visible!">
        <div
            className="flex w-80 cursor-pointer flex-col items-stretch rounded-2xl border-0 pt-2 bg-[radial-gradient(circle,#0891b2_0%,#ffffff_100%)]"
            aria-label="View invite F7RA"
            style={{
            transform: "none",
            opacity: 1,
            }}
        >
            <div className="mx-2 flex-1 border border-gray-200 rounded-xl">
            <div className="relative mt-2 aspect-3/4 w-full">
                <img
                loading="lazy"
                className="absolute h-full w-[420px] max-w-[420px] transform -translate-x-18 z-150 -translate-y-2 object-cover"
                alt="Invite background"
                src={image}
                style={{
                    opacity: 1,
                    display: "block",
                    scale: "1.14",
                }}
                />
            </div>
            </div>
            <div className="mt-2 flex shrink-0 items-center justify-between p-4 font-mono text-black">
            <div className="text-xs">Comet Invitation</div>
            <div className="text-xs text-gray-800 opacity-50">#F7RA</div>
            </div>
        </div>
    </CometCard>
  );
}