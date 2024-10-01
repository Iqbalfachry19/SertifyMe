import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai"; //
function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {[
              { name: "Facebook", icon: FaFacebookF },
              { name: "Instagram", icon: FaInstagram },
              { name: "X", icon: AiOutlineTwitter },
              { name: "GitHub", icon: FaGithub },
              { name: "LinkedIn", icon: FaLinkedinIn },
            ].map(({ name, icon: Icon }) => (
              <a
                key={name}
                href="#"
                className="text-gray-400 hover:text-gray-300"
              >
                <span className="sr-only">{name}</span>
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; 2024 SertifyMe, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
