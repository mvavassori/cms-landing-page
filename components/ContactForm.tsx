"use client";

import { useActionState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Mail, MapPin, Phone } from "lucide-react";

type ApiErrorResponse = {
    data: null;
    error: {
        status: number;
        name: string;
        message: string; // This is the message we want to display
        details?: any;
    };
};

async function sendContactForm(previousState: unknown, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Basic validation example (can be expanded)
    if (!name || !email || !message) {
        return { error: "Please fill out all fields." };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    const path = "/api/contacts";
    const baseUrl = process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
    const url = new URL(path, baseUrl);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({
                data: {
                    name,
                    email,
                    message,
                },
            }),
        });
        if (!response.ok) {
            let errorMsg = `Failed to send message. Status: ${response.status}`;
            try {
                // Attempt to parse the specific error structure from the API
                const errorBody: ApiErrorResponse = await response.json();
                if (errorBody?.error?.message) {
                    errorMsg = errorBody.error.message;
                }
                console.error("API Error Details:", errorBody);
            } catch (e) {
                // If parsing fails or structure is unexpected, use the generic status message
                console.error("Failed to parse error response:", e);
            }
            console.error("API Error:", errorMsg);
            return { error: errorMsg }; // Return error state for the UI
        }
        const data = await response.json();
        console.log("Form submitted successfully:", data);
        // Return a success state for the UI
        return {
            message: "Your message has been sent successfully!",
            data: data,
        };
    } catch (error) {
        console.error("Network or unexpected error:", error);
        return {
            error: "An unexpected error occurred. Please try again later.",
        };
    }
}

export default function ContactForm() {
    const [state, formAction, isPending] = useActionState(
        sendContactForm,
        undefined
    );

    return (
        <section className="container mx-auto py-12" id="contact">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
                Contact Us
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Contact Information Column */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-50 p-8 rounded-lg shadow-sm h-full">
                        <h3 className="text-xl font-semibold mb-6">
                            Get In Touch
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="mt-1 mr-4 text-primary">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Email</h4>
                                    <p className="text-zinc-600">
                                        contact@example.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="mt-1 mr-4 text-primary">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Location</h4>
                                    <p className="text-zinc-600">
                                        123 Innovation Way
                                    </p>
                                    <p className="text-zinc-600">
                                        San Francisco, CA 94103
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="mt-1 mr-4 text-primary">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Phone</h4>
                                    <p className="text-zinc-600">
                                        (555) 123-4567
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-200">
                            <h3 className="text-lg font-medium mb-3">
                                Office Hours
                            </h3>
                            <p className="text-zinc-600">
                                Monday - Friday: 9am - 5pm
                            </p>
                            <p className="text-zinc-600">
                                Saturday & Sunday: Closed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-100 h-full">
                        <h3 className="text-xl font-semibold mb-6">
                            Send Us a Message
                        </h3>

                        <form
                            action={formAction}
                            className="grid grid-rows-[auto_auto_1fr_auto] gap-6"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    required
                                    placeholder="How can we help?"
                                    rows={6}
                                    className="resize-none"
                                />
                            </div>

                            <div></div>

                            <div>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full sm:w-auto"
                                >
                                    {isPending ? "Sending..." : "Send Message"}
                                </Button>

                                <div className="mt-4 text-sm h-5 flex items-center">
                                    {state?.error && (
                                        <span className="text-red-500">
                                            {state.error}
                                        </span>
                                    )}
                                    {state?.message && (
                                        <span className="text-emerald-600">
                                            {state.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
