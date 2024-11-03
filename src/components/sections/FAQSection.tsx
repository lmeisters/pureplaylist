import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
            answer: "You can filter tracks by keywords (in title or album), artists, genres, and more. Multiple filters can be combined for precise results.",
        },
        {
            question: "Is my Spotify data secure?",
            answer: "Yes, we use official Spotify OAuth for authentication and only request necessary permissions to manage your playlists.",
        },
    ];

    return (
        <Section variant="gray" id="faq">
            <div className="flex flex-col items-center">
                <div className="text-center space-y-4 mb-8">
                    <Badge variant="secondary">FAQ</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="w-full max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </Section>
    );
}

export default FAQSection;
