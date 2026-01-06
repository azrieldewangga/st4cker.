import { Input } from "@/components/ui/input"

export function Search({ onClick }: { onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="cursor-pointer"
            aria-label="Open search"
        >
            <Input
                type="search"
                placeholder="Search... (Ctrl+F)"
                className="md:w-[100px] lg:w-[300px] pointer-events-none" // prevent typing, force click
                readOnly
                tabIndex={-1} // remove input from tab order, button handles focus
            />
        </button>
    )
}
