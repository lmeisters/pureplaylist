import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedElement } from "@/components/ui/animated-element";

function FAQSection() {
    const faqs = [
        {
            question: "Is PurePlaylist free to use?",
            answer: "Yes, PurePlaylist is completely free to use. You just need a Spotify account to get started.",
        },
        {
            question: "Will this modify my original playlists?",
            answer: "Only if you choose to. You can either update your existing playlist or create a new one with your filtered selections.",
        },
        {
            question: "What types of filters are available?",
            answer: "You can filter tracks by keywords (in title or album), artists, and more coming soon. Multiple filters can be combined for precise results.",
        },
        {
            question: "Do you store my Spotify playlists?",
            answer: "No, we don't store any personal data or playlists. PurePlaylist interacts directly with the Spotify API, and all data stays securely within your Spotify account.",
        },
        {
            question: "Is my Spotify data secure?",
            answer: "Yes, we use official Spotify OAuth for authentication and only request necessary permissions to manage your playlists.",
        },
    ];

    return (
        <Section variant="gray" id="faq" size="half">
            <div className="flex flex-col items-center">
                <AnimatedElement
                    index={0}
                    className="text-center space-y-4 mb-8"
                    threshold={0.4}
                >
                    <Badge variant="outline" className="bg-white">
                        FAQ
                    </Badge>
                    <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                </AnimatedElement>

                <div className="w-full max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AnimatedElement
                                key={index}
                                index={index + 1}
                                threshold={0.2}
                            >
                                <AccordionItem value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </AnimatedElement>
                        ))}
                    </Accordion>
                </div>
            </div>
        </Section>
    );
}

export default FAQSection;
