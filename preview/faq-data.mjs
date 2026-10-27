// FAQ copy (2026-10-27 build brief). Six categories, rendered on faq.html with a
// chip row, mirrored into FAQPage JSON-LD and llms.txt by gen.mjs. Answers may
// carry links; the schema and llms.txt get the plain-text version. Site voice:
// no contractions, no em dashes, numbers only from the fact sheet.
export const FAQ_CATEGORIES = [
  { id: 'about', label: 'About', title: 'About Startup Ventura', items: [
    ['What is Startup Ventura?', 'Startup Ventura is a 501(c)(3) nonprofit startup accelerator for Ventura County, California. We give early-stage founders mentorship, capital connections, and a community so they can build high-growth companies here instead of leaving for Los Angeles or San Francisco. Founded 2025. EIN 39-2204612. Candid 2026 Platinum Seal.'],
    ['Is the accelerator free for founders?', 'Yes. There is no tuition, no fee, and we take no equity. Donors, community partners, and the City of Ventura, which approved $49,500 through its Economic Development department, fund the program.'],
    ['Does Startup Ventura invest in the companies?', 'No. We do not write checks and we do not take equity. What we do is make warm introductions to investors throughout the 12 weeks and put you in front of invited investors at Demo Day.'],
    ['Who runs Startup Ventura?', 'Luke Erickson is the Founder and Executive Director. A board of operators and civic leaders, including executives from Curri and SevenRooms, governs the organization. <a href="about.html#board">See the board</a>.'],
    ['What does Plug and Play add?', 'Startup Ventura runs the accelerator in an official partnership with Plug and Play. It is Plug and Play&rsquo;s first formal accelerator program in Ventura County and the launch point for its expanded Southern California focus. Plug and Play reports 60+ locations on five continents, 550+ Fortune 1000 corporate partners, and 2,500+ startups accelerated per year (company announcements, January 29 and March 26, 2026).'],
    ['Where is Startup Ventura located?', 'We serve founders across Ventura County. Program sessions rotate across the county at partner venues: local technology company offices, public venues, and evening events at local spots. Accepted founders get the schedule.'],
    ['Is my donation tax-deductible?', 'Yes, to the extent allowed by law. Startup Ventura is a 501(c)(3) public charity, EIN 39-2204612. <a href="give.html">Gifts</a> fund the inaugural cohort and the program around it.'],
  ] },
  { id: 'applying', label: 'Applying', title: 'Applying', items: [
    ['Who can apply?', 'Early-stage founders based in or building in Ventura County, from idea stage to early revenue. Founders and co-founders may apply. You need to be able to attend the weekly in-person day in Ventura County and give the company 8 to 12 hours a week during the program.'],
    ['When do applications open and close?', 'Applications for the Spring 2027 cohort open in January 2027 and close in late February 2027. Join the <a href="apply.html">first-access list</a> and we will send the link the day applications open.'],
    ['I am not in Ventura County. Can I still apply?', 'Yes, if you commit to building here: base the company in the county and attend the weekly in-person day. Founders moving from out of the area or from outside the United States should read our <a href="soft-landing.html">soft-landing page</a> first.'],
    ['What do you look for?', 'Founders first, then the team. We look for commitment to building in Ventura County, clarity about the problem and the customer, how fast you have executed so far, and how you take feedback. We prefer two or more founders with complementary skills. Traction helps, but it is not required.'],
    ['What stage should my company be at?', 'Anywhere from an idea to early revenue. You do not need to be incorporated to apply, but accepted companies should be incorporated by kickoff. If you have already raised money, apply anyway; we review those case by case if the company is still early.'],
    ['Can I apply as a solo founder?', 'Yes, case by case. We prefer teams of two or more with complementary skills, and strong solo founders should still apply.'],
    ['Can I apply if I am a student or have a full-time job?', 'Yes, case by case. The program takes 8 to 12 hours a week plus the in-person day. Tell us in your application how you will make the time.'],
    ['Which industries do you accept?', 'Any sector. Given Ventura County&rsquo;s strengths, we expect the first cohort to include biotech, defense, and AI and software companies, but every application is read on the strength of the founder.'],
    ['Do I need to attend the workshop series before applying?', 'No. The <a href="workshops.html">workshop series</a> is free, open to anyone, and separate from the accelerator. Attending has no bearing on your application.'],
    ['Does it cost anything to apply?', 'No.'],
    ['How do I apply?', 'Through the application portal when it opens in January 2027. Until then, the <a href="apply.html">first-access list</a> is the way in: we send the link the day applications open.'],
    ['I have two ideas. Which should I apply with?', 'The one you are most committed to building. One application per team.'],
  ] },
  { id: 'after-you-apply', label: 'After you apply', title: 'After you apply', items: [
    ['How are applications reviewed?', 'Three steps. First the written application, where the founder carries more weight than the idea. Then a screening call, where we listen for clarity, drive, and commitment. Then a founder deep-dive, the main interview.'],
    ['How long until I hear back?', 'Every applicant hears back. Decisions take four to six weeks from a complete application.'],
    ['Can I get feedback if I am not accepted?', 'We cannot give individual feedback on every application. Founders who are not accepted are welcome to apply to a later cohort, and the <a href="workshops.html">workshop series</a> and <a href="resources.html">Founder Resources</a> are open to everyone.'],
    ['Can I update my application after submitting?', 'Email updates to <a href="mailto:info@startupventura.com">info@startupventura.com</a> with your company name in the subject line and we will attach them to your application.'],
    ['Can I reapply?', 'Yes. Apply again to a later cohort and tell us what changed.'],
  ] },
  { id: 'the-program', label: 'The program', title: 'The program', items: [
    ['How long is the program, and when does it run?', 'Twelve weeks, Spring 2027, in Ventura County. The start date is announced with decisions.'],
    ['Is the program in person or remote?', 'Hybrid. One in-person day each week in Ventura County; the rest of the week is remote.'],
    ['How much time will it take?', 'Plan on 8 to 12 hours a week: the in-person day, office hours, mentor meetings, and work on your company between sessions.'],
    ['Where are sessions held?', 'Across Ventura County at partner venues: local technology company offices, public venues, and evening events at local spots. Accepted founders get the full schedule.'],
    ['What do I get?', 'Operator mentors who have built and scaled companies, weekly Lunch &amp; Learns, open office hours, warm introductions to investors, a cohort of founders building alongside you, and a Demo Day in front of invited investors.'],
    ['How do mentors work?', 'Three ways. Mentor speed dating early in the program, so you meet many mentors fast and find the fits. Open office hours throughout the 12 weeks. And industry-specific mentors matched to your company&rsquo;s sector.'],
    ['How many companies are in a cohort?', 'Five to ten.'],
    ['Does Startup Ventura take equity or intellectual property?', 'No. No equity, no IP, no fees. You own your company.'],
    ['What is expected of me?', 'Attend the weekly in-person day, show up for office hours and mentor meetings, and present at Demo Day.'],
  ] },
  { id: 'demo-day', label: 'Demo Day and after', title: 'Demo Day and after', items: [
    ['What is Demo Day?', 'The close of the 12 weeks, in Ventura, roughly June or July 2027. Founders present to invited investors, partners, and City and County guests. The exact date is set with the program calendar.'],
    ['Do I have to raise money at Demo Day?', 'Presenting is part of the program. Whether and when you raise is your call.'],
    ['What happens after Demo Day?', 'Your mentor relationships continue, you stay in the Startup Ventura founder community, and we keep making investor introductions.'],
  ] },
  { id: 'partners', label: 'Partners, mentors and donors', title: 'Partners, mentors and donors', items: [
    ['How can I mentor?', 'Mentors commit to a cohort: speed dating sessions early on, office hours during the program, and matches with companies in your industry. Tell us about yourself on the <a href="mentor.html">mentor form</a>.'],
    ['How can my company get involved?', 'Host a session at your office, sponsor the cohort, mentor, or be a pilot customer for a cohort company. Start on the <a href="partner.html">Partner page</a> or email <a href="mailto:sponsor@startupventura.com">sponsor@startupventura.com</a>.'],
    ['How are cities and the County involved?', 'The City of Ventura approved $49,500 for the program through its Economic Development department. We report five metrics annually: founders served by jurisdiction, companies launched in the county, jobs at graduation and 12 months, follow-on capital, and founders retained. See <a href="partner-cities-county.html">For Cities &amp; County</a>.'],
    ['Can investors attend Demo Day?', 'Yes, by invitation. Request one on the <a href="invest.html">Invest page</a> or email <a href="mailto:info@startupventura.com">info@startupventura.com</a>.'],
    ['How can I support founders?', '<a href="give.html">Give</a>. Gifts fund the inaugural Spring 2027 cohort and the program around it, and every donor appears on the <a href="donor-wall.html">donor wall</a>.'],
  ] },
];
// Plain text for schema and llms.txt: strip tags, decode the entities the copy uses.
export const faqPlain = (s) => s.replace(/<[^>]+>/g, '').replace(/&rsquo;/g, '\u2019').replace(/&lsquo;/g, '\u2018').replace(/&ldquo;/g, '\u201c').replace(/&rdquo;/g, '\u201d').replace(/&amp;/g, '&').replace(/&middot;/g, '\u00b7').replace(/&nbsp;/g, ' ');
