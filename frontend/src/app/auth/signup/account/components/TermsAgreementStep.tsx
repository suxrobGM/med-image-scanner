"use client";
import {Typography, Stack} from "@mui/material";
import {useScrollToBottom} from "@/core/hooks";

interface TermsAgreementStepProps {
  onValid?: () => void;
  onInvalid?: () => void;
}

export function TermsAgreementStep(props: TermsAgreementStepProps) {
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
      <Typography>Welcome to [Platform Name]!</Typography>
      <Typography>
        These Terms and Conditions ("Terms", "Terms and Conditions") govern your relationship with [Platform Name]
        (the "Service") operated by [Your Company Name] ("us", "we", or "our"). Please read these Terms and
        Conditions carefully before using our Service.
      </Typography>
      <Typography>
        By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
        the terms, then you may not access the Service.
      </Typography>
      <Typography>
        1. Accounts When you create an account with us, you must provide us with information that is accurate,
        complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in
        immediate termination of your account on our Service. You are responsible for safeguarding the password that
        you use to access the Service and for any activities or actions under your password, whether your password
        is with our Service or a third-party service. You agree not to disclose your password to any third party.
        You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your
        account.
      </Typography>
      <Typography>
        2. 2FA Setup For enhanced security, you are required to set up two-factor authentication (2FA) during the
        registration process. This involves linking an authenticator app to your account and providing a
        verification code each time you log in. Failure to complete this step will prevent access to the Service.
      </Typography>
      <Typography>
        3. Intellectual Property The Service and its original content, features, and functionality are and will
        remain the exclusive property of [Your Company Name] and its licensors. The Service is protected by
        copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and
        trade dress may not be used in connection with any product or service without the prior written consent of
        [Your Company Name].
      </Typography>
      <Typography>
        4. Termination We may terminate or suspend your account immediately, without prior notice or liability, for
        any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to
        use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue
        using the Service.
      </Typography>
      <Typography>
        5. Limitation of Liability In no event shall [Your Company Name], nor its directors, employees, partners,
        agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or
        punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
        losses, resulting from (i) your use or inability to use the Service; (ii) any unauthorized access to or use
        of our servers and/or any personal information stored therein; (iii) any interruption or cessation of
        transmission to or from the Service; (iv) any bugs, viruses, trojan horses, or the like that may be
        transmitted to or through our Service by any third party; and (v) any errors or omissions in any content or
        for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or
        otherwise made available through the Service, whether based on warranty, contract, tort (including
        negligence), or any other legal theory, whether or not we have been informed of the possibility of such
        damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
      </Typography>
      <Typography>
        6. Governing Law These Terms shall be governed and construed in accordance with the laws of [Your
        State/Country], without regard to its conflict of law provisions. Our failure to enforce any right or
        provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is
        held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in
        effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and
        replace any prior agreements we might have had between us regarding the Service.
      </Typography>
      <Typography>
        7. Changes We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
        revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What
        constitutes a material change will be determined at our sole discretion. By continuing to access or use our
        Service after those revisions become effective, you agree to be bound by the revised terms. If you do not
        agree to the new terms, please stop using the Service.
      </Typography>
      <Typography>
        8. Contact Us If you have any questions about these Terms, please contact us at: [Your Contact Information]
      </Typography>
    </Stack>
  );
}
