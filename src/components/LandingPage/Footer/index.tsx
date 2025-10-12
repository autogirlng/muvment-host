import React from "react";
import Link from "next/link";
import Image from "next/image";
import InputField from "@/ui/inputField";
import { customerAppUrl } from "@/utils/data";
import { Formik, Form } from "formik";
import { newLetterValidationSchema } from "@/utils/validationSchema";
import useNewsletter from "@/hooks/useNewsletter";
import Button from "@/ui/button";
import { footer_logo } from "@/ui/assets";
import { Icons } from "@/ui";

type FooterNavProps = {
    title: string;
    links: { name: string; link?: string; badgeTitle?: string }[];
};

const footerNav: FooterNavProps[] = [
    {
        title: "Company",
        links: [
            { name: "About us", link: "/" },
            { name: "Contact us", link: "/" },
            // { name: "Careers", link: "", badgeTitle: "We're hiring!" },
            // { name: "Events", link: "" },
            { name: "FAQs", link: "/" },
        ],
    },
    {
        title: "Locations",
        links: [
            { name: "Lagos", link: `${customerAppUrl}/explore/cities/lagos` },
            { name: "Abuja", link: `${customerAppUrl}/explore/cities/abuja` },
            { name: "Benin City", link: `${customerAppUrl}/explore/cities/benin` },
            { name: "Enugu", link: `${customerAppUrl}/explore/cities/enugu` },
            {
                name: "Port Harcourt",
                link: `${customerAppUrl}/explore/cities/port-harcourt`,
            },
            { name: "Accra", link: `${customerAppUrl}/explore/cities/accra` },
        ],
    },
    {
        title: "Explore",
        links: [
            { name: "Get paid", link: "/signup" },
            {
                name: "Book a vehicle",
                link: customerAppUrl,
            },
            { name: "Vehicle types", link: `${customerAppUrl}/explore/categories?type=truck` },
            // { name: "Find your location", link: "/" },
        ],
    },
];

type Props = {};

function Footer({ }: Props) {
    const { addSubscriber } = useNewsletter();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-2 md:px-10 md:pb-[220px]">
            <div className="py-8 md:py-20 px-6 md:px-[60px] lg:px-[100px] 3xl:px-[143px] bg-grey-75 md:rounded-[74px]">
                <div className="w-full max-w-[1553px] mx-auto text-grey-500 space-y-8 md:space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8 3xl:gap-10 gap-y-10">
                        <div className="md:col-span-3 lg:col-span-2 space-y-10 max-w-[471px]">
                            <Image src={footer_logo} alt="" width={438} height={45} />
                            <p className="!font-normal text-xl 3xl:text-h6">
                                Be the first to receive all the recent updates, articles, and
                                valuable materials.
                            </p>
                            <Formik
                                initialValues={{ email: "" }}
                                validationSchema={newLetterValidationSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    console.log("Form values:", values);
                                    await addSubscriber({ email: values.email });
                                    setSubmitting(false);
                                }}
                                enableReinitialize={true}
                                validateOnChange={true}
                                validateOnBlur={true}
                            >
                                {({
                                    values,
                                    touched,
                                    errors,
                                    isValid,
                                    dirty,
                                    handleBlur,
                                    handleChange,
                                    isSubmitting,
                                }) => (
                                    <Form className="flex flex-col md:flex-row gap-[10px]">
                                        <InputField
                                            name="email"
                                            id="email"
                                            placeholder="Email Address"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.email && touched.email ? errors.email : ""}
                                        />
                                        <Button
                                            type="submit"
                                            color="primary"
                                            variant="filled"
                                            className="!rounded-[18px] !py-4 !px-[28px] h-fit"
                                            loading={isSubmitting}
                                            disabled={isSubmitting || !isValid}
                                        >
                                            Subscribe
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                            {/* <div className="flex flex-col md:flex-row gap-[10px]">
                <InputField
                  name="email"
                  id="email"
                  placeholder="Email Address"
                />
                <Button
                  color="primary"
                  variant="filled"
                  className="!rounded-[25.56px] !py-4 !px-[28px]"
                  onClick={newsLetter}
                >
                  Subscribe
                </Button>
              </div> */}
                        </div>
                        {footerNav.map((nav) => (
                            <div
                                className="space-y-[30px] !font-normal text-xl 3xl:text-h6"
                                key={nav.title}
                            >
                                <p className="text-grey-400">{nav.title}</p>
                                <ul className="space-y-5 list-none">
                                    {nav.links.map((navLink) => (
                                        <li key={navLink.name} className="flex gap-1">
                                            {navLink.link ? (
                                                <Link href={navLink.link}>{navLink.name}</Link>
                                            ) : (
                                                <span>{navLink.name}</span>
                                            )}
                                            {navLink.badgeTitle && (
                                                <span className="bg-primary-50 !font-medium text-nowrap text-sm 3xl:text-base text-primary-700 py-[2px] px-3 rounded-[15px]">
                                                    {navLink.badgeTitle}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-grey-200">
                        <div className="w-full md:w-fit flex flex-col md:flex-row items-center gap-5 md:gap-10">
                            <div className="w-full md:w-fit flex flex-col md:flex-row md:items-center gap-5 md:gap-10 text-xl md:text-base">
                                <Link href="/terms-of-service" className="font-medium">
                                    Terms of Service
                                </Link>
                                <Link href="/privacy-policy" className="font-medium">
                                    Privacy Policy
                                </Link>
                            </div>
                            <div className="w-full md:w-fit flex items-center justify-center gap-5 mt-5 md:mt-0 py-10 md:py-0 border-t border-grey-200 md:border-none">
                                <Link href="https://www.instagram.com/autogirlng/#" target="_blank" >{Icons.ic_instagram}</Link>
                                <Link href="https://x.com/autogirlng" target="_blank">{Icons.ic_twitter}</Link>
                                <Link href="https://www.tiktok.com/@autogirl.ng" target="_blank">{Icons.ic_tiktok}</Link>
                                <Link href='https://www.facebook.com/autogirlng?_rdc=1&_rdr#' target="_blank">{Icons.ic_facebook}</Link>
                                <Link href='https://www.linkedin.com/company/autogirl/' target="_blank">{Icons.ic_linkedin}</Link>
                            </div>
                        </div>
                        <p className="text-sm md:text-base text-grey-400 ">
                            © <span>{currentYear}</span> Muvment. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
