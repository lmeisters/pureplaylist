"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function AppHeader() {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    return (
        <header className="bg-background border-b">
            <div className="w-full px-4 sm:px-4 flex justify-between items-center py-2">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/icon.png"
                        alt="PurePlaylist"
                        width={24}
                        height={24}
                    />
                    <h1 className="text-xl font-semibold">PurePlaylist</h1>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => signOut()}
                >
                    Sign Out
                </Button>
            </div>
        </header>
    );
}

export default AppHeader;
