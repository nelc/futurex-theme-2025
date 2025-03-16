import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';

// import Footer from '@edly-io/indigo-frontend-component-footer';
import { getConfig } from '@edx/frontend-platform';
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

let themeCookie = 'indigo-toggle-dark';
let themeCookieExpiry = 90; // days

const AddDarkTheme = () => {
  const cookies = new Cookies();
  const isThemeToggleEnabled = getConfig().INDIGO_ENABLE_DARK_TOGGLE;

  const getCookieExpiry = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + themeCookieExpiry);
  };

  const getCookieOptions = () => {
    const serverURL = new URL(getConfig().LMS_BASE_URL);
    const options = { domain: serverURL.hostname, path: '/', expires: getCookieExpiry() };
    return options;
  };

  const addDarkThemeToIframes = () => {
    const iframes = document.getElementsByTagName('iframe');
    const iframesLength = iframes.length;
    if (iframesLength > 0) {
      Array.from({ length: iframesLength }).forEach((_, index) => {
        const style = document.createElement('style');
        style.textContent = `
          body{
            background-color: #0D0D0E;
            color: #ccc;
          }
          a {color: #ccc;}
          a:hover{color: #d3d3d3;}
          `;
        if (iframes[index].contentDocument) { iframes[index].contentDocument.head.appendChild(style); }
      });
    }
  };

  useEffect(() => {
    const theme = cookies.get(themeCookie);

    // - When page loads, Footer loads before MFE content. Since there is no iframe on page,
    // it does not append any class. MutationObserver observes changes in DOM and hence appends dark
    // attributes when iframe is added. After 15 sec, this observer is destroyed to conserve resources. 
    // - It has been added outside dark-theme condition so that it can be removed on Component Unmount.
    // - Observer can be passed to `addDarkThemeToIframes` function and disconnected after observing Iframe.
    // This approach has a limitation: the observer first detects the iframe and then detects the docSrc. 
    // We need to wait for docSrc to fully load before appending the style tag.
    const observer = new MutationObserver(() => {
      addDarkThemeToIframes();
    });

    if (isThemeToggleEnabled && theme === 'dark') {
      document.body.classList.add('indigo-dark-theme');
      
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer?.disconnect(), 15000); // clear after 15 sec to avoid resource usage

      cookies.set(themeCookie, theme, getCookieOptions());      //  on page load, update expiry
    }

    return () => observer?.disconnect();
  }, []);

  return (<div />);
};

const NewFooter = () => {
  return (<div class='newFooterWrapper'>  <footer class="footerWrap">
    <div class="footerWrap__content container">
      <div class="footerWrap__copyRight">
        Copyrights ©2025. All Rights Reserved.
      </div>
      <div class="footerWrap__links">
        <a href="#">Terms and Conditions</a>
        <a href="#">Contact Us</a>
      </div>
      <div class="footerWrap__social">
        <a href="#">
          <svg  class="footerWrap__social-icon" width="24" aria-label="facebook" role="img"  height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8433 5.16823H16V2H13.4107C12.2632 2.0014 11.1631 2.46271 10.3518 3.28274C9.54037 4.10277 9.08393 5.21457 9.08255 6.37427V8.33647H7V11.5047H9.08986V22H12.2247V11.5047H15.3814L16 8.33647H12.2247V5.79238C12.2271 5.62743 12.2931 5.46994 12.4086 5.35339C12.5241 5.23684 12.68 5.17041 12.8433 5.16823Z" />
          </svg>
           </a>
        <a href="#">
          <svg class="footerWrap__social-icon" width="24" aria-label="facebook" role="img" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22 5.89188C21.2512 6.22008 20.4573 6.43413 19.645 6.52688C20.4962 6.02485 21.1359 5.23054 21.445 4.29188C20.6377 4.76245 19.7571 5.09407 18.84 5.27288C18.4536 4.86948 17.9894 4.54867 17.4755 4.32986C16.9616 4.11105 16.4086 3.99879 15.85 3.99988C15.3156 3.99566 14.7856 4.09678 14.2903 4.29745C13.795 4.49813 13.3441 4.79442 12.9634 5.16941C12.5826 5.54441 12.2795 5.99074 12.0713 6.48293C11.8631 6.97511 11.7539 7.50349 11.75 8.03788C11.7493 8.34725 11.7846 8.65564 11.855 8.95688C10.2296 8.87937 8.63813 8.46379 7.18233 7.73667C5.72653 7.00954 4.43834 5.98685 3.4 4.73388C3.03722 5.34929 2.8456 6.05051 2.845 6.76488C2.84547 7.4325 3.01241 8.08947 3.33072 8.67632C3.64903 9.26318 4.10866 9.76139 4.668 10.1259C4.01779 10.1067 3.38112 9.93543 2.809 9.62588V9.67588C2.8148 10.6146 3.14597 11.5223 3.74609 12.2443C4.3462 12.9662 5.1781 13.4577 6.1 13.6349C5.74707 13.7292 5.38331 13.7769 5.018 13.7769C4.75836 13.7762 4.49931 13.7521 4.244 13.7049C4.51331 14.5119 5.02652 15.2153 5.71275 15.7181C6.39898 16.2209 7.22439 16.4983 8.075 16.5119C6.34562 17.8403 4.16557 18.4403 2 18.1839C3.88216 19.374 6.06415 20.0039 8.291 19.9999C9.8157 20.0228 11.3297 19.7423 12.745 19.1747C14.1603 18.607 15.4485 17.7636 16.5348 16.6934C17.6211 15.6232 18.4836 14.3477 19.0724 12.9411C19.6611 11.5344 19.9642 10.0248 19.964 8.49988C19.964 8.32288 19.964 8.15088 19.952 7.97688C20.7548 7.41144 21.4486 6.7054 22 5.89288V5.89188Z"/>
            </svg>
              
        </a>
        <a href="#"><svg class="footerWrap__social-icon" width="24" aria-label="facebook" role="img" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7984 9.02127C15.1519 8.99403 14.509 9.12466 13.9326 9.40035C13.3563 9.67603 12.8664 10.0873 12.5109 10.5938V9.00928H9.34293V19H12.5333V14.1845C12.5333 12.9137 12.8448 11.6868 14.672 11.6868C16.5557 11.6868 16.8 13.1394 16.8 14.2684V19H20V13.66C20 11.0374 19.2533 9.02127 15.7984 9.02127Z" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.6 5C5.28355 5 4.97421 5.08789 4.71109 5.25256C4.44797 5.41723 4.24289 5.65128 4.12179 5.92512C4.00069 6.19895 3.96901 6.50027 4.03074 6.79097C4.09248 7.08167 4.24487 7.3487 4.46863 7.55828C4.69239 7.76787 4.97749 7.9106 5.28786 7.96842C5.59823 8.02625 5.91993 7.99657 6.21229 7.88314C6.50466 7.76972 6.75454 7.57764 6.93035 7.33119C7.10616 7.08475 7.2 6.79501 7.2 6.49861C7.2 6.10115 7.03143 5.71998 6.73137 5.43893C6.43131 5.15789 6.02435 5 5.6 5Z" />
          <path d="M7.2 9.02127H4V19H7.2V9.02127Z" />
          </svg>
           </a>
        <a href="#"><svg class="footerWrap__social-icon" width="24" aria-label="facebook" role="img" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9674 8.82647L17.8687 2H15.2344L10.7299 7.21374L6.7339 2H1L7.6906 10.7273L1.4032 18H4.0375L8.9281 12.3444L13.2661 18H19L11.9674 8.82647ZM9.9271 11.1868L8.6896 9.57141L3.88 3.30167H5.86L9.7408 8.35546L10.9783 9.97084L16.1362 16.6983H14.1562L9.9271 11.1868Z" />
          </svg>
           </a>
      </div>
    </div>
  </footer> </div>);
};

const themePluginSlot = {
  keepDefault: false,
  plugins: [
    {
      op: PLUGIN_OPERATIONS.Insert,
      widget: {
        id: 'default_contents',
        type: DIRECT_PLUGIN,
        priority: 1,
        RenderWidget: <NewFooter />,
      },
    },
    {
      op: PLUGIN_OPERATIONS.Insert,
      widget: {
        id: 'read_theme_cookie',
        type: DIRECT_PLUGIN,
        priority: 2,
        RenderWidget: AddDarkTheme,
      },
    },
  ],
};

const config = {
  pluginSlots: {
    footer_slot: themePluginSlot,
  },
};

export default config;