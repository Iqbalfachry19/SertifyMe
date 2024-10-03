import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
    { name: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
    { name: "X", icon: AiOutlineTwitter, href: "https://x.com" },
    { name: "GitHub", icon: FaGithub, href: "https://github.com" },
    { name: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
  ];

  const footerLinks = [
    { name: t("about"), href: "#" },
    { name: t("services"), href: "#" },
    { name: t("contact"), href: "#" },
    { name: t("privacyPolicy"), href: "#" },
    { name: t("termsOfService"), href: "#" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-2xl font-bold">{t("sertifyMe")}</h2>
            <p className="text-gray-400 text-sm">{t("footerDescription")}</p>
            <div className="flex space-x-6">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  {t("solutions")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    t("blockchain"),
                    t("nft"),
                    t("verification"),
                    t("education"),
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  {t("support")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    t("pricing"),
                    t("documentation"),
                    t("guides"),
                    t("apiStatus"),
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  {t("company")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.map(({ name, href }) => (
                    <li key={name}>
                      <a
                        href={href}
                        className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  {t("subscribe")}
                </h3>
                <p className="mt-4 text-base text-gray-400">
                  {t("subscribeText")}
                </p>
                <form className="mt-4 sm:flex sm:max-w-md">
                  <Input
                    type="email"
                    name="email-address"
                    id="email-address"
                    required
                    placeholder={t("emailPlaceholder")}
                    className="appearance-none min-w-0 w-full bg-gray-700 border border-transparent rounded-md py-2 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-300"
                  />
                  <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <Button
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                    >
                      {t("subscribe")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {footerLinks.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} {t("sertifyMe")}, Inc.{" "}
            {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
