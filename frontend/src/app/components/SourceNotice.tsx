import { ATTRIBUTION_LINE, sourceCodeUrl } from "@clausemoor/client";

/**
 * AGPL section 13: people using the app over the network can get the
 * corresponding source. The link stays on screen; settings repeats it
 * with the attribution line.
 */
export function SourceNotice({ detailed = false }: { detailed?: boolean }) {
    const href = sourceCodeUrl();
    if (detailed) {
        return (
            <footer className="space-y-2 text-xs leading-5 text-gray-500">
                <p>{ATTRIBUTION_LINE}</p>
                <p>
                    <a
                        href={href}
                        className="font-medium text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-gray-950"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Source code
                    </a>
                </p>
            </footer>
        );
    }
    return (
        <a
            href={href}
            className="pointer-events-auto fixed bottom-2 left-2 z-40 rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
            target="_blank"
            rel="noreferrer"
        >
            Source code
        </a>
    );
}
