"use client";

import {Stack, Typography} from "@mui/material";
import {useScrollToBottom} from "@/core/hooks";

interface PrivacyAgreementStepProps {
  onValid?: () => void;
}

export function PrivacyAgreementStep(props: PrivacyAgreementStepProps) {
  const contentRef = useScrollToBottom(() => props.onValid?.());

  return (
    <Stack
      ref={contentRef}
      gap={2}
      maxHeight={500}
      sx={{
        padding: "1rem",
        overflowY: "scroll",
        textAlign: "left",
        border: "1px solid",
        borderRadius: "8px",
      }}
    >
      <Typography>Last updated: [Date]</Typography>
      <Typography>
        This HIPAA Privacy Notice ("Notice") describes how [Your Company Name] ("we," "our," "us")
        may use and disclose your Protected Health Information (PHI) and how you can access this
        information. Please review it carefully. By using [Platform Name], you acknowledge and agree
        to the terms outlined in this Notice.
      </Typography>

      <Typography>
        1. Introduction The Health Insurance Portability and Accountability Act of 1996 (HIPAA) is a
        federal law that requires the protection and confidential handling of protected health
        information. We are committed to protecting the privacy and security of your PHI and
        complying with HIPAA regulations.
      </Typography>

      <Typography>
        2. Protected Health Information (PHI) PHI refers to individually identifiable health
        information that is transmitted or maintained in any form or medium. This information
        includes demographics, medical history, test and laboratory results, insurance information,
        and other data used to identify an individual.
      </Typography>

      <Typography>
        3. Uses and Disclosures of PHI We may use and disclose your PHI for the following purposes:
        a. Treatment To provide and coordinate your healthcare and related services. b. Payment To
        obtain payment for services provided to you, including billing and collections. c.
        Healthcare Operations To support our business activities, including quality assessment,
        training, licensing, and credentialing activities.
      </Typography>

      <Typography>
        4. Other Permitted and Required Uses and Disclosures We may use or disclose your PHI in the
        following situations without your authorization: When required by law For public health
        activities For health oversight activities In judicial and administrative proceedings For
        law enforcement purposes To avert a serious threat to health or safety For research
        purposes, under certain conditions For workers’ compensation or similar programs
      </Typography>

      <Typography>
        5. Your Rights Regarding PHI You have the following rights regarding your PHI: a. Right to
        Inspect and Copy You have the right to inspect and obtain a copy of your PHI. b. Right to
        Amend You have the right to request an amendment of your PHI if you believe it is incorrect
        or incomplete. c. Right to an Accounting of Disclosures You have the right to request a list
        of certain disclosures we have made of your PHI. d. Right to Request Restrictions You have
        the right to request restrictions on certain uses and disclosures of your PHI. e. Right to
        Request Confidential Communications You have the right to request that we communicate with
        you about medical matters in a certain way or at a certain location.
      </Typography>

      <Typography>
        6. Responsibilities of [Your Company Name] We are required by law to: Maintain the privacy
        and security of your PHI Provide you with this Notice of our legal duties and privacy
        practices Abide by the terms of the Notice currently in effect
      </Typography>

      <Typography>
        7. Changes to This Notice We reserve the right to change this Notice at any time and to make
        the revised Notice effective for all PHI we maintain. The revised Notice will be posted on
        our website and provided upon request.
      </Typography>

      <Typography>
        8. Complaints If you believe your privacy rights have been violated, you may file a
        complaint with us or with the Secretary of the Department of Health and Human Services. We
        will not retaliate against you for filing a complaint.
      </Typography>

      <Typography>
        9. Contact Information If you have any questions about this Notice or wish to exercise any
        of your rights, please contact us at:
      </Typography>

      <Typography>
        [Your Company Name][Address][City, State, ZIP Code][Phone Number][Email Address]
      </Typography>
    </Stack>
  );
}
