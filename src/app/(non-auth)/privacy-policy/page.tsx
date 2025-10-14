"use client";
import { Footer } from "@/components/Footer";
import { DesktopNav, MobileNav } from "@/components/Navbar";
import { TermsContentContainer, NumberedList, TermsSection, SectionNav, PolicyHeader, ParagraphText } from "@/components/TermsOfService";
import { sections, generalTerms, generalRentalItems, cancellationNoticeItems } from "@/utils/data/nonAuth";

function PrivacyPolicy() {
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbars with higher z-index */}
            <DesktopNav user={null} userToken={""} />
            <MobileNav user={null} userToken={""} />

            <PolicyHeader
                title="Privacy Policy"
                imageSrc="/images/logo_icon_blue.svg"
                date={currentDate}
                bgColor="bg-[#0673FF]"
            />

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row pt-5 lg:pt-20">
                {" "}
                {/* Account for navbar height */}
                {/* Desktop Navigation Sidebar */}
                <div className=" lg:w-64 flex-shrink-0 px-4 sticky top-5 lg:top-20  lg:h-[calc(100vh-5rem)]">
                    <SectionNav sections={sections} />
                </div>
                {/* Content */}
                <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <TermsContentContainer className="bg-white ">
                        <TermsSection title="General Terms" id="general-terms">
                            <ParagraphText>{generalTerms}</ParagraphText>
                        </TermsSection>

                        <TermsSection title="General Rental" id="general-refund">
                            <NumberedList items={generalRentalItems} className="space-y-4" />
                        </TermsSection>

                        <TermsSection
                            title="Cancellation and Refunds"
                            id="cancellation-refunds"
                        >
                            <NumberedList
                                items={cancellationNoticeItems}
                                className="space-y-4"
                            />
                        </TermsSection>
                    </TermsContentContainer>
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default PrivacyPolicy;
