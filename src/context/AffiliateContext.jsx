import { createContext, useState } from "react";

export const AffiliateContext = createContext();

export const AffiliateProvider = ({ children }) => {
  const affiliateData = JSON.parse(localStorage.getItem("affiliate_data") || "null");
  const affiliateToken = localStorage.getItem("affiliate_token");

  const [affiliate, setAffiliate] = useState(() => {
    if (!affiliateData || !affiliateToken) return null;
    return {
      Id: affiliateData.Id,
      FullName: affiliateData.FullName,
      Email: affiliateData.Email,
      AffiliateURL: affiliateData.AffiliateURL,
      TrackingID: affiliateData.TrackingID,
      PayoutsDriveUrl: affiliateData.PayoutsDriveUrl,
      Status: affiliateData.Status,
      role: "affiliate",
      token: affiliateToken,
    };
  });

  const value = { affiliate, setAffiliate };

  return (
    <AffiliateContext.Provider value={value}>
      {children}
    </AffiliateContext.Provider>
  );
};
