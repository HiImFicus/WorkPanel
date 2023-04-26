import { useLiveQuery } from "dexie-react-hooks";
import csvDownload from "json-to-csv-export";
import React, { useContext, useState } from "react";

import {
	Accordion,
	Badge,
	Box,
	Button,
	createStyles,
	Flex,
	LoadingOverlay,
	rem,
	Table,
} from "@mantine/core";
import { IconBrandGoogle, IconFileExport } from "@tabler/icons-react";

import { getCurrentDate } from "../../../../common/Helps";
import { Stock } from "../database/Database";
import { dataServiceContext } from "../database/DataserviceContext";

const useStyles = createStyles((theme) => ({
	header: {
		position: "sticky",
		top: 0,
		backgroundColor:
			theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
		boxShadow: theme.shadows.sm,

		"&::after": {
			content: '""',
			position: "absolute",
			borderBottom: `${rem(1)} solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[3]
					: theme.colors.gray[2]
			}`,
		},
	},
}));

const descriptionFront = `<font rwr="1" style="font-family:Arial"><section class="header-cover text-center" style="font-size: 14pt; box-sizing: inherit; padding: 3rem 4rem; background-color: rgb(255, 255, 255); height: 304.688px; text-align: center !important;"><div class="header-bar text-center" style="box-sizing: inherit; color: rgb(255, 255, 255); background-color: transparent; max-width: 760px; margin: 0px auto; padding: 30px 0px 0px;"><h1 class="header-title has-my-30" style="box-sizing: inherit; font-size: 2.2rem; margin-right: 0px; margin-left: 0px; line-height: 1.1; font-family: Palanquin, sans-serif; background-color: rgb(50, 72, 234); padding: 40px; border-radius: 100px; margin-top: 1.875rem !important; margin-bottom: 1.875rem !important;">ATG WIRELESS</h1></div></section><main class="main-content" style="box-sizing: inherit; background-color: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.13) 0px -5px 25px 0px; margin-left: -1rem; margin-right: -1rem; position: relative; font-family: Palanquin, sans-serif;"><section class="clearfix" id="presentation" style="box-sizing: inherit; padding: 3rem 4rem; position: relative; margin-bottom: 320px; z-index: 2; background-color: rgb(242, 252, 252);"><div class="card-unstyled has-my-30" id="block-description" style="box-sizing: inherit; background-color: transparent; border-color: transparent; border-radius: 0px; position: relative; padding-bottom: 30px; margin-top: 1.875rem !important; margin-bottom: 1.875rem !important;"><div class="card-block" style="box-sizing: inherit; padding: 0px;"><h3 class="western" style="box-sizing: inherit; margin-top: 0px; margin-bottom: 1rem; line-height: 1.1; font-family: Arial; text-align: center;"><font size="7">`;
const descriptionBack = `</font></h3><h3 class="western" style="font-size: 14pt; box-sizing: inherit; margin-top: 0px; margin-bottom: 1rem; font-weight: 500; line-height: 1.1; font-family: Arial; text-align: center;"><span style="box-sizing: inherit; font-weight: bolder;"><font size="7" style="box-sizing: inherit;"><br></font></span></h3><h3 class="western" style="font-size: 14pt; box-sizing: inherit; margin-top: 0px; margin-bottom: 1rem; font-weight: 500; line-height: 1.1; font-family: Arial; text-align: center;"><span style="box-sizing: inherit; font-weight: bolder;"><font size="7" style="box-sizing: inherit;">Product Description:</font></span></h3><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;"><font size="4" style="box-sizing: inherit;">!!&nbsp;</font><font size="5" style="box-sizing: inherit;">BUYER&nbsp;</font><font size="4" style="box-sizing: inherit;">!!</font></span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font color="#ff0010" size="4" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">BEFORE BIDDING/PURCHASING, PLEASE READ &amp; CONSIDER THE FOLLOWING:</span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;"><br style="box-sizing: inherit;"></span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">ALL "USED"DEVICES HAVE PASSED OUR TESTING PROCEDURE:</span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;"><br style="box-sizing: inherit;"></span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">Please scroll down the page and refer to the item description for NOTES, TESTED PORTS, MISSING PARTS, AND COSMETIC DAMAGE!!!</span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;"><br style="box-sizing: inherit;"></span></font></div><div style="font-size: 14pt; box-sizing: inherit; font-family: Arial; text-align: center;"><span style="box-sizing: inherit; font-weight: bolder; background-color: transparent; font-size: large;"><i style="box-sizing: inherit;"><font color="#08d6f7" style="box-sizing: inherit;">(Please use "Mouse Over To Zoom" feature on product photos for better examination of product)</font></i></span></div><br style="box-sizing: inherit;"><br style="box-sizing: inherit;"><p style="font-size: 14pt; box-sizing: inherit; margin-top: 0px; margin-bottom: 1rem; font-family: Arial;"><span style="box-sizing: inherit; font-weight: bolder;"><font color="#ff0010" style="box-sizing: inherit;">&nbsp; &nbsp; &nbsp; &nbsp;**WE DO NOT INCLUDE OTHER ACCESSORIES UNLESS SHOWN IN PICTURE/DESCRIPTION **&nbsp;</font></span></p><p dir="ltr" style="font-size: 14pt; box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; font-family: Arial; line-height: 1.38; margin-left: 36pt; text-align: center;"><span style="box-sizing: inherit; font-size: 14pt; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"><br style="box-sizing: inherit;"></span></p><p dir="ltr" style="font-size: 14pt; box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; font-family: Arial; line-height: 1.38; margin-left: 36pt; text-align: center;"><span style="box-sizing: inherit; font-size: 14pt; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">THE ITEM(S) THAT YOU SEE IN THE PICTURES / LISTING DESCRIPTION IS INCLUDED WITH YOUR PURCHASE</span></p><p dir="ltr" style="font-size: 14pt; box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; font-family: Arial; line-height: 1.38; margin-left: 36pt; text-align: center;"><span style="box-sizing: inherit; font-size: 14pt; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"><br style="box-sizing: inherit;"></span></p><p dir="ltr" style="font-size: 14pt; box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; font-family: Arial; line-height: 1.38; margin-left: 36pt; text-align: center;"><span style="box-sizing: inherit; font-size: 14pt; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">No other <i style="box-sizing: inherit;">ASSUMED</i> accessories, companions, manuals, equipment, extra parts, cables, power supplies, cords, boxes, etc. that are not mentioned or pictured. </span></p><p dir="ltr" style="font-size: 14pt; box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; font-family: Arial; line-height: 1.38; margin-left: 36pt; text-align: center;"><span style="box-sizing: inherit; background-color: transparent; font-size: 14pt; font-weight: 700; white-space: pre-wrap;"><br style="box-sizing: inherit;"></span></p><p dir="ltr" style="font-size: 14pt; box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; font-family: Arial; line-height: 1.38; margin-left: 36pt; text-align: center;"><span style="box-sizing: inherit; background-color: transparent; font-size: 14pt; font-weight: 700; white-space: pre-wrap;"><font face="Arial" color="#ff9936" style="box-sizing: inherit;"><u style="box-sizing: inherit;">If you have a question, please ask us before bidding or purchasing.</u></font></span></p></div></div><section class="clearfix arrow-top" id="information" style="font-size: 14pt; box-sizing: inherit; padding: 3rem 4rem; background-color: rgb(255, 255, 255); font-family: Arial;"><div class="card-unstyled has-mb-30" id="block-payment" style="box-sizing: inherit; background-color: transparent; border-color: transparent; border-radius: 0px; position: relative; padding-bottom: 30px; font-size: 14pt; margin-bottom: 1.875rem !important;"><div class="card-block" style="box-sizing: inherit; padding: 0px;"><ul style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: inherit;"><font size="4" color="#ff0010" style="box-sizing: inherit;">**<span style="box-sizing: inherit; font-weight: bolder;"><u style="box-sizing: inherit;">Please confirm prior to purchasing that this item is compatible with your application. We are not responsible for compatibility issues after purchase</u></span>**</font></li><li style="box-sizing: inherit;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span id="docs-internal-guid-0f69f947-7fff-3585-c4d7-b57835af0aae" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-size: 14pt; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Full payment is expected within 48 hours of purchase.</span></span></font></li><li style="box-sizing: inherit;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit;"><span style="box-sizing: inherit; font-size: 14pt; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Buyers can make COMBINED payments within 12 hours.</span></span></font></li><li style="box-sizing: inherit;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit;"><span style="box-sizing: inherit; font-size: 14pt; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Please note that after 7 days, an eBay "unpaid" case will automatically be opened.</span><span style="box-sizing: inherit; font-size: 14pt; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"> &nbsp;Please contact us if you would like to make other arrangements.</span></span></font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">PayPal is our preferred method of payment. If for any reason you're unable to make the payment please contact us.&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">PayPal payments must be from a verified PayPal account.</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">We do not accept any other form of payment (No exceptions)</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Sales tax will be added to winning bid amount to California residents.&nbsp;</font></li></ul></div></div><div class="card-unstyled has-mb-30" id="block-shipping" style="box-sizing: inherit; background-color: transparent; border-color: transparent; border-radius: 0px; position: relative; padding-bottom: 30px; font-size: 14pt; margin-bottom: 1.875rem !important;"><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; font-weight: bolder; background-color: transparent; font-family: Palanquin, sans-serif; font-size: 1.75rem; text-align: center;"><font color="#ff6a35" style="box-sizing: inherit;">Shipping</font></span></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><ul style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px;"><li dir="ltr" style="box-sizing: inherit; list-style-type: disc; font-size: 14pt; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre;"><p dir="ltr" style="box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.656;"><span style="box-sizing: inherit; font-size: 14pt; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">OUR SHIPPING CUT-OFF TIME IS 2 PM PST. &nbsp;ANY ITEMS PAID AFTER THIS TIME WILL NOT SHIP UNTIL THE FOLLOWING BUSINESS DAY.</span></p></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">We only ship to confirmed address as indicated in PayPal. Please make sure that the address you provided at checkout is correct.&nbsp;<span style="box-sizing: inherit; font-weight: bolder;"><font color="#ff0010" style="box-sizing: inherit;"><u style="box-sizing: inherit;">This is in order to protect you.</u></font></span></font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">For&nbsp;<span style="box-sizing: inherit; font-weight: bolder;">PO Box orders</span>, we will automatically have them shipped through USPS. USPS may take longer than UPS Ground and can not guarantee estimated delivery time.&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">A surcharge will be added for Alaska, Hawaii, and Puerto Rico buyers.&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;"><u style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">All International orders will be shipped through eBay's Global Shipping Program (GSP).</span></u></font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Standard&nbsp;<span style="box-sizing: inherit; font-weight: bolder;"><u style="box-sizing: inherit;">Handling time</u></span>: 2-3 business days from the date of payment. We will notify the customer of any delay that may happen,&nbsp; we don't work on Saturday and Sunday.</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Estimated Order&nbsp;<span style="box-sizing: inherit; font-weight: bolder;"><u style="box-sizing: inherit;">Transit time</u></span>: 2-8 business days from the shipment date.</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">We ship all orders using Fedex or USPS at our own discretion.</font></li></ul><div style="box-sizing: inherit;"><font size="3" style="box-sizing: inherit;"><br style="box-sizing: inherit;"></font></div></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><font color="#ff6a35" style="box-sizing: inherit; font-family: Palanquin, sans-serif; font-size: 1.75rem; text-align: center;"><span style="box-sizing: inherit; font-weight: bolder;">Returns</span></font></div><div class="card-block" style="box-sizing: inherit; padding: 0px;"><div class="card-block" style="box-sizing: inherit; padding: 0px;"><ul style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px; font-size: 14pt;"><li style="box-sizing: inherit;"><font face="Arial" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;"><i style="box-sizing: inherit;">There will be no exception to this policy.</i></span>&nbsp;By placing a&nbsp; order with us you have entered into a binding agreement that you acknowledge and accept our procedures.</font></li><li style="box-sizing: inherit;"><font face="Arial" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">For International Buyers:</span></font></li><ul style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: inherit;"><font face="Arial" style="box-sizing: inherit;">We are not responsible for duties and taxes. Those are to be paid by the recipient/buyer.</font></li><li style="box-sizing: inherit;"><font face="Arial" style="box-sizing: inherit;">No returns for International buyers.</font></li><li style="box-sizing: inherit;">Refunds are only on the final price that the item was sold for!!</li><li style="box-sizing: inherit;">We are not responsible for shipping costs on the buyer's end (no shipping cost refunds).&nbsp;</li></ul><li style="box-sizing: inherit; font-size: 14pt;"><font size="4" color="#ff0010" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;"><u style="box-sizing: inherit;">YOUR SATISFACTION IS OUR MOST PRIORITY!!!</u></span></font></li><ul style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: inherit;">If a piece of equipment is defective in any way that is not described, please message us via eBay messaging and we will do our best to troubleshoot or replace the defective equipment.&nbsp;</li><li style="box-sizing: inherit;">If we do not have a replacement piece in stock, we will refund the cost of the equipment.</li></ul><li style="box-sizing: inherit; font-size: 14pt;"><font size="4" style="box-sizing: inherit;">Items must be returned in the same condition they were in when shipped.</font></li><li style="box-sizing: inherit; font-size: 14pt;"><font size="4" style="box-sizing: inherit;">30 Day Money Back Guarantee for end users.</font></li></ul><div style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;"><br style="box-sizing: inherit;"></font></div><div style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder; color: rgb(255, 106, 53); font-family: Palanquin, sans-serif; font-size: 28px; text-align: center;">In Case of Damaged Parcel***</span></div><div style="box-sizing: inherit;"><ul style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">A carrier might damage items during shipping.&nbsp;&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Please inspect the package well before accepting the shipment from the carrier.&nbsp;&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">If you notice any damage to the box or the shipment, please&nbsp;<span style="box-sizing: inherit; font-weight: bolder;"><u style="box-sizing: inherit;"><font color="#ff0010" style="box-sizing: inherit;">don't accept the parcel.</font></u></span>&nbsp;&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">To report a damaged<span style="box-sizing: inherit; color: rgb(34, 34, 34); background-color: transparent;">&nbsp;parcel, please&nbsp;<span style="box-sizing: inherit; font-weight: bolder;">contact us</span>.&nbsp;&nbsp;</span></font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">We will follow up and file a "damage claim" with the carrier.&nbsp;&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">All shipping, packaging materials, and<span style="box-sizing: inherit; color: rgb(34, 34, 34); background-color: transparent;">&nbsp;boxes must be saved.&nbsp;&nbsp;</span></font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Carriers will pick up<span style="box-sizing: inherit; color: rgb(34, 34, 34); background-color: transparent;">&nbsp;the damaged item for inspection.&nbsp;&nbsp;</span></font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Failure to provide everything necessary for us to file a damaged claim will void your warranty.&nbsp;&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">We can't file a damage claim if you accept the shipment.</span>&nbsp;&nbsp;</font></li><li style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">Therefore,&nbsp;<span style="box-sizing: inherit; font-weight: bolder;">we are not liable for any damage if the shipment is accepted and we were not contacted within the time limit.</span>&nbsp;</font></li></ul></div></div></div></div><div class="card-unstyled has-mb-30" id="block-terms" style="box-sizing: inherit; background-color: transparent; border-color: transparent; border-radius: 0px; margin-bottom: 1.875rem !important; position: relative; padding-bottom: 30px;"><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; color: rgb(0, 44, 253); font-family: Palanquin, sans-serif; font-size: 28px; font-weight: 700; text-align: center;">Feedback</span></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; font-size: 18.6667px; white-space: pre-wrap; background-color: transparent;">Positive Feedback is left for Buyers once merchandise is paid for, so let us know you are happy with the transaction by leaving us positive feedback!</span><span style="box-sizing: inherit; text-align: center;"><font size="4" face="Arial" style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">&nbsp;Please do not leave negative or neutral feedback without giving us the opportunity to remedy the situation first if you are displeased with our transaction.</span>&nbsp;<span style="box-sizing: inherit; font-weight: bolder;">We cannot fix situations we are unaware of.</span>&nbsp;We make every effort to provide outstanding products and service but we are only human and sometimes things go wrong. We appreciate your patience and opportunity to correct a situation if that happens.</font></span></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; font-family: Palanquin, sans-serif; font-size: 28px; font-weight: 700; text-align: center;"><font color="#002cfd" style="box-sizing: inherit;"><br style="box-sizing: inherit;"></font></span></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; font-family: Palanquin, sans-serif; font-size: 28px; font-weight: 700; text-align: center;"><font color="#002cfd" style="box-sizing: inherit;">Contact Us</font></span></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; font-family: &quot;Helvetica neue&quot;, Helvetica, Verdana, sans-serif;"><font size="4" style="box-sizing: inherit;">Please feel free to contact us via eBay messaging with any questions or concerns you may have. If for any reason you have an issue with your purchase,&nbsp;<span style="box-sizing: inherit; font-weight: bolder;">please reach out to us before leaving feedback. Customer satisfaction is our #1 priority.</span></font></span></div><div class="card-block" style="box-sizing: inherit; padding: 0px; font-size: 14pt;"><span style="box-sizing: inherit; font-family: &quot;Helvetica neue&quot;, Helvetica, Verdana, sans-serif;"><font size="4" style="box-sizing: inherit;"><br style="box-sizing: inherit;"></font></span></div><div class="card-block" style="box-sizing: inherit; padding: 0px;"><div style="box-sizing: inherit; color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif;"><span style="box-sizing: inherit; font-weight: bolder;"><u style="box-sizing: inherit;"><font size="4" style="box-sizing: inherit;">ATG Wireless Business Hours</font></u></span></div><div style="box-sizing: inherit; color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif;"><font size="4" style="box-sizing: inherit;">Monday-Friday&nbsp;</font></div><div style="box-sizing: inherit; color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif;"><font size="4" style="box-sizing: inherit;">8 a.m.-5 p.m. PST</font></div><div style="box-sizing: inherit; color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif;"><font size="4" style="box-sizing: inherit;">(Closed: Saturdays, Sundays, Most major U.S. holidays)</font></div><div style="box-sizing: inherit; font-family: Arial, Helvetica, sans-serif;"><br style="box-sizing: inherit;"></div><div style="box-sizing: inherit; font-family: Arial, Helvetica, sans-serif;"><span id="docs-internal-guid-20ae90ed-7fff-662d-1146-817f431310d1" style="box-sizing: inherit;"><p dir="ltr" style="box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;"><span style="box-sizing: inherit; font-size: 14pt; font-family: Arial; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">This is an actual business with business hours of (8am-12pm,1pm-5pm) PST. Questions will be answered during this time.</span></p><p dir="ltr" style="box-sizing: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;"><span style="box-sizing: inherit; font-size: 14pt; font-family: Arial; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">We expect our buyers to do the proper research before buying.&nbsp;Due to the volume of our business, we will usually not answer questions that can be easily answered by a small amount of research on the buyers part.&nbsp;If you have specific questions that cannot be answered by using Google or the manufacturer's website, feel free to ask us. </span></p><div style="box-sizing: inherit;"><span style="box-sizing: inherit; font-size: 14pt; font-family: Arial; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"><br style="box-sizing: inherit;"></span></div></span></div><div style="box-sizing: inherit; text-align: center; font-family: Arial, Helvetica, sans-serif;"><font size="4" color="#002cfd" style="box-sizing: inherit;"><i style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">Thank you for choosing ATG Wireless!</span></i></font></div><div style="box-sizing: inherit; text-align: center; font-family: Arial, Helvetica, sans-serif;"><font size="4" color="#002cfd" style="box-sizing: inherit;"><i style="box-sizing: inherit;"><span style="box-sizing: inherit; font-weight: bolder;">Your business is appreciated.</span></i></font></div></div></div></section></section></main></font>`;

interface eBayList {
	Action: "Add";
	CustomLabel: string;
	Category: 27386;
	StoreCategory: 35353099011;
	title: string;
	Subtitle: string | null;
	Relationship: string | null;
	RelationshipDetails: string | null;
	ConditionID: 2500;
	ConditionDescription: "Tested 100% Performance, and 100% Working for All Display Ports, Ready for Resale";
	Brand: string;
	ChipsetManufacturer: string;
	ChipsetGPUModel: string;
	MemorySize: string;
	MemoryType: string;
	CompatibleSlot: string;
	Connectors: string;
	Features: "Multiple Monitor Support";
	MPN: string;
	UnitQuantity: 1;
	UnitType: "Unit";
	PowerCableRequirement: string | null;
	APIs: string | null;
	CoolingComponentIncluded: string | null;
	CountryRegionofManufacture: string | null;
	CaliforniaProp65Warning: string | null;
	ItemHeight: string | null;
	ItemLength: string | null;
	ItemWidth: string | null;
	ManufacturerWarranty: string | null;
	PicURL: string;
	GalleryType: string | null;
	Description: string;
	Format: "FixedPrice";
	Duration: "GTC";
	StartPrice: string;
	BuyItNowPrice: string | null;
	Quantity: number;
	PayPalAccepted: 1;
	PayPalEmailAddress: "support@atgwirelessebay.com",
	ImmediatePayRequired: "",
	PaymentInstructions: "",
	Location: "Chino Hills CA";
	PostalCode: "91709";
	WeightMajor: 0,
	WeightMinor: 14,
	WeightUnit: 1,
	ShippingType: "",
	"ShippingService-1:Option": "",
	"ShippingService-1:Cost": "",
	"ShippingService-2:Option": "",
	"ShippingService-2:Cost": "",
	DispatchTimeMax: 3,
	PromotionalShippingDiscount: "",
	ShippingDiscountProfileID: "",
	ReturnsAcceptedOption: "ReturnsAccepted",
	ReturnsWithinOption: "Days_30",
	RefundOption: "",
	ShippingCostPaidByOption: "Buyer",
	AdditionalDetails: "",
	ShippingProfileName: "Standard 1-5 Day Free",
	ReturnProfileName: "ReturnsAccepted30",
	PaymentProfileName: "eBay Payments",
	TakeBackPolicyID: "",
	ProductCompliancePolicyID: "",
}

function genSellRowByStock(form: "LP" | "HP",stock: Stock, stocks: Stock[]): eBayList {
	const partNumber = stock.partNumbers.replaceAll(",", " ");
	let quantity = stocks.length;
	if (quantity > 2) {
		quantity = Math.floor(quantity / 2);
	}
	let title =  `${stock.brand} ${stock.model}|${partNumber}|${stock.memory} VideoCard|${form}|${stock.ports.replace(/[0-9]/g, "").replaceAll("x", "").replaceAll(" ", "").replace("DMS-", "DMS-59")}| TESTED`;

	if (title.length > 80) {
		title = title.replaceAll("VideoCard", "GPU");
	}
	if (title.length > 80) {
		title = title.replaceAll("TESTED", "");
	}

	if (title.length > 80) {
		console.log(title)
	}

	return {
		Action: "Add",
		CustomLabel:
			"GPU-" + stock.partNumbers + "(" + form + ")" + "_" + stock.location,
		Category: 27386,
		StoreCategory: 35353099011,
		title: title,
		Subtitle: "",
		Relationship: "",
		RelationshipDetails: "",
		ConditionID: 2500,
		ConditionDescription:
			"Tested 100% Performance, and 100% Working for All Display Ports, Ready for Resale",
		Brand: stock.brand,
		ChipsetManufacturer: stock.silicon,
		ChipsetGPUModel: stock.silicon + " " + stock.model,
		MemorySize: stock.memory,
		MemoryType: stock.memoryType,
		CompatibleSlot: stock.compatibleSlot,
		Connectors: stock.ports.replaceAll(",", "; "),
		Features: "Multiple Monitor Support",
		MPN: stock.partNumbers,
		UnitQuantity: 1,
		UnitType: "Unit",
		PowerCableRequirement: "",
		APIs: "",
		CoolingComponentIncluded: "",
		CountryRegionofManufacture: "",
		CaliforniaProp65Warning: "",
		ItemHeight: "",
		ItemLength: "",
		ItemWidth: "",
		ManufacturerWarranty: "",
		PicURL: stock.picUrl,
		GalleryType: "",
		Description: descriptionFront + title + descriptionBack,
		Format: "FixedPrice",
		Duration: "GTC",
		StartPrice: stock.price,
		BuyItNowPrice: "",
		Quantity: quantity,
		PayPalAccepted: 1,
		PayPalEmailAddress: "support@atgwirelessebay.com",
		ImmediatePayRequired: "",
		PaymentInstructions: "",
		Location: "Chino Hills CA",
		PostalCode: "91709",
		WeightMajor: 0,
		WeightMinor: 14,
		WeightUnit: 1,
		ShippingType: "",
		"ShippingService-1:Option": "",
		"ShippingService-1:Cost": "",
		"ShippingService-2:Option": "",
		"ShippingService-2:Cost": "",
		DispatchTimeMax: 3,
		PromotionalShippingDiscount: "",
		ShippingDiscountProfileID: "",
		ReturnsAcceptedOption: "ReturnsAccepted",
		ReturnsWithinOption: "Days_30",
		RefundOption: "",
		ShippingCostPaidByOption: "Buyer",
		AdditionalDetails: "",
		ShippingProfileName: "Standard 1-5 Day Free",
		ReturnProfileName: "ReturnsAccepted30",
		PaymentProfileName: "eBay Payments",
		TakeBackPolicyID: "",
		ProductCompliancePolicyID: "",
	};
}

const SellList = () => {
	function organizeData(stocks: Stock[]) {
		const data = [];

		// Group by model
		const groupedByModel = stocks.reduce((acc : any, curr) => {
			const { model, partNumbers, state, status, defect } = curr;
			if (!acc[model]) {
				acc[model] = {
					model: model,
					partNumbers: [],
					partNumbersCount: 0,
					GPU: 0,
					working: 0,
					broken: 0,
					inStock: 0,
					standby: 0,
					defect: 0,
					out: 0,
				};
			}

			const modelData = acc[model];
			modelData.GPU++;
			if (state === "working") {
				modelData.working++;
			} else if (state === "broken") {
				modelData.broken++;
			}

			if (status === "in" && state === "working") {
				modelData.inStock++;
			}

			if (status === "in" && state === "working" && defect === "") {
				modelData.standby++;
			}

			if (defect !== "") {
				modelData.defect++;
			}
			if (status === "out" && state === "working") {
				modelData.out++;
			}
			// Group by part number
			const partNumberObj = modelData.partNumbers.find(
				(p: any) => p.partNumber === partNumbers
			);
			if (!partNumberObj) {
				modelData.partNumbers.push({
					partNumber: partNumbers,
					stocks: [],
					GPU: 0,
					working: 0,
					broken: 0,
					inStock: 0,
					standby: 0,
					defect: 0,
					out: 0,
				});
				modelData.partNumbersCount++;
			}

			const partNumberData = modelData.partNumbers.find(
				(p: any) => p.partNumber === partNumbers
			);
			partNumberData.stocks.push(curr);
			partNumberData.GPU++;
			if (state === "working") {
				partNumberData.working++;
			} else if (state === "broken") {
				partNumberData.broken++;
			}

			if (status === "in" && state === "working") {
				partNumberData.inStock++;
			}

			if (status === "in" && state === "working" && defect === "") {
				partNumberData.standby++;
			}

			if (defect !== "") {
				partNumberData.defect++;
			}
			if (status === "out" && state === "working") {
				partNumberData.out++;
			}

			return acc;
		}, {});

		// Convert to array
		for (const modelData of Object.values(groupedByModel)) {
			data.push(modelData);
		}

		return data;
	}
	const { classes } = useStyles();

	const [disableExport, setDisableExport] = useState(true);
	const [visible, setVisible] = useState(true);
	const dataService = useContext(dataServiceContext);
	const stocks = useLiveQuery(() =>
		dataService?.getStocksOrderBy("model").then((stocks) => {
			const result = organizeData(stocks);
			if (stocks.length > 0 && disableExport) {
				setDisableExport(false);
			}
			setVisible(false);
			return result;
		})
	);

	const rows = stocks?.map((element: any) => (
		<React.Fragment key={element.model}>
			<tr>
				<td>{element.model}</td>
				<td>
					{element.standby ? (
						<Badge color="green" variant="filled">
							{element.standby}
						</Badge>
					) : (
						<Badge color="pink" variant="filled">
							{element.standby}
						</Badge>
					)}
				</td>
				<td>{element.partNumbersCount}</td>
				<td>{element.GPU}</td>
				<td>{element.working}</td>
				<td>{element.broken}</td>
				<td>{element.inStock}</td>
				<td>{element.defect}</td>
				<td>{element.out}</td>
			</tr>
			{element.partNumbers && (
				<tr style={{ textAlign: "center" }}>
					<td colSpan={9}>
						<Accordion multiple defaultValue={element.partNumbers[0].partNumber}>
							{element.partNumbers.map((part: any) => {
								return (
									<Accordion.Item
										value={part.partNumber + element.model}
										key={part.partNumber}
									>
										<Accordion.Control>
											<Flex
												gap="md"
												justify="space-between"
												align="center"
												direction="row"
											>
												<Badge variant="filled">{part.partNumber}</Badge>
												{part.standby ? (
													<Badge color="green" variant="filled">
														{`standby: ${part.standby}`}
													</Badge>
												) : (
													<Badge color="pink" variant="filled">
														{`standby: ${part.standby}`}
													</Badge>
												)}
												<Badge color="cyan">{`total: ${part.GPU}`}</Badge>
												<Badge color="orange">{`working: ${part.working}`}</Badge>
												<Badge color="red">{`broken: ${part.broken}`}</Badge>
												<Badge
													color="grape"
													variant="outline"
												>{`inStock: ${part.inStock}`}</Badge>
												<Badge color="dark">{`defect: ${part.defect}`}</Badge>
												<Badge color="gray">{`out: ${part.out}`}</Badge>
											</Flex>
										</Accordion.Control>
										<Accordion.Panel>
											<Table>
												<thead>
													<tr>
														<th>Id</th>
														<th>Silicon</th>
														<th>model</th>
														<th>brand</th>
														<th>memory</th>
														<th>formFactor</th>
														<th>ports</th>
														<th>part #</th>
														<th>state</th>
														<th>status</th>
														<th>defect</th>
														<th>date</th>
													</tr>
												</thead>
												<tbody>
													{part.stocks.map((stock: any) => (
														<tr key={stock.id}>
															<td>{stock.id}</td>
															<td>{stock.silicon}</td>
															<td>{stock.model}</td>
															<td>{stock.brand}</td>
															<td>{stock.memory}</td>
															<td>{stock.formFactor}</td>
															<td>{stock.ports}</td>
															<td>{stock.partNumbers}</td>
															<td>
																{stock.state === "working" ? (
																	<Badge color="green" variant="filled">
																		{stock.state}
																	</Badge>
																) : (
																	<Badge color="pink" variant="filled">
																		{stock.state}
																	</Badge>
																)}
															</td>
															<td>
																{stock.status === "in" ? (
																	<Badge color="green" variant="filled">
																		{stock.status}
																	</Badge>
																) : (
																	<Badge color="pink" variant="filled">
																		{stock.status}
																	</Badge>
																)}
															</td>
															<td>
																{stock.state === "working" &&
																stock.defect === "" ? (
																	<Badge color="green" variant="filled"></Badge>
																) : (
																	<Badge color="pink" variant="filled">
																		{stock.defect}
																	</Badge>
																)}
															</td>
															<td>{stock.date}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</Accordion.Panel>
									</Accordion.Item>
								);
							})}
						</Accordion>
					</td>
				</tr>
			)}
			<tr>
				<td colSpan={9}></td>
			</tr>
		</React.Fragment>
	));

	const report = {
		partNumberCount: 0,
		modelCount: 0,
		total: 0,
		standbyForSell: 0,
		standbyPartNumberCount: 0,
		standbyDifferenceProfileCount: 0,
		defect: 0,
		out: 0,
		broken: 0,
	};
	const differentProfileStocks: any[] = [];
	const sellList: eBayList[] = [];
	stocks?.map((item: any) => {
		report.partNumberCount += item.partNumbersCount;
		report.modelCount++;
		report.total += item.GPU;
		report.standbyForSell += item.standby;
		report.defect += item.defect;
		report.out += item.out;
		report.broken += item.broken;

		//generate sell list
		item.partNumbers.map((partNumber: any) => {
			if (partNumber.standby) {
				report.standbyPartNumberCount++;
				const lpStocks = partNumber.stocks.filter(
					(every: any) => every.formFactor === "L - PROFILE" && every.status === "in" && every.state === "working" && every.defect === ""
				);
				const hpStocks = partNumber.stocks.filter(
					(every: any) => every.formFactor === "H - PROFILE" && every.status === "in" && every.state === "working" && every.defect === ""
				);

				if (lpStocks.length > 0) {
					sellList.push(genSellRowByStock("LP", lpStocks[0], lpStocks));
				}

				if (hpStocks.length > 0) {
					sellList.push(genSellRowByStock("HP", hpStocks[0], hpStocks));

				}

				const stock = partNumber.stocks[0];
				const firstProfile = stock.formFactor;
				const differentProfiles = partNumber.stocks.filter(
					(every: any) => every.formFactor !== firstProfile && every.status === "in" && every.state === "working" && every.defect === ""
				);
				if (differentProfiles.length > 0) {
					report.standbyDifferenceProfileCount++;
					differentProfileStocks.push(differentProfiles)
				}
			}
		});
	});

	function getReport(){
		console.log("report", report);
		console.log("differentProfiles", differentProfileStocks);
		console.log("sellList", sellList);
	}

	function getExportMetaData() {
		return {
			data: sellList,
			filename: "eBay_list_" + getCurrentDate(),
			delimiter: ",",
		};
	}

	return (
		<Box pos="relative">
			<LoadingOverlay visible={visible} overlayBlur={2} />
			<Button.Group>
				<Button
					leftIcon={<IconFileExport size="1rem" />}
					variant="gradient"
					gradient={{ from: "orange", to: "red" }}
					disabled={disableExport}
					onClick={() => csvDownload(getExportMetaData())}
				>
					Export Sell List
				</Button>
				<Button
					leftIcon={<IconBrandGoogle size="1rem" />}
					variant="gradient"
					gradient={{ from: "red", to: "indigo" }}
					disabled={disableExport}
					onClick={getReport}
				>
					report to console
			</Button>
			</Button.Group>
			<Table striped highlightOnHover withColumnBorders>
				<thead className={classes.header}>
					<tr>
						<th>Model</th>
						<th>Standby</th>
						<th>Part # Qty</th>
						<th>Total</th>
						<th>Working</th>
						<th>Broken</th>
						<th>InStock</th>
						<th>Defect</th>
						<th>Out</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
		</Box>
	);
};

export default SellList;
