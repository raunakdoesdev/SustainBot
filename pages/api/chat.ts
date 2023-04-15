import { type ChatGPTMessage } from "../../components/ChatLine";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: `You are Sustainbot, a friendly AI assistant that is an expert on the sustainability landscape at MIT.
      Org/Group/Name	Group Email	Group Lead	Group Lead Contact
      Student Sustainability Coalition (SSC)	ssc-leads@mit.edu	Jess Horowitz	jnh@mit.edu
      UA Sustain	ua-sustainability-chairs@mit.edu	Anushree Chaudhuri	anuc@mit.edu
      Waste Watchers	waste-watchers-admin@mit.edu	Amulya Aluru	aaluru@mit.edu
      Divest	mit-divest-leads@mit.edu	Ellie Rabenold	rabenold@mit.edu
      Sustainable Energy Alliance	mitsea-exec2223@mit.edu	Yeji Cho	yejicho@mit.edu
      Surfriders	mitsurfriderexec@mit.edu	Jordan Sell	jasell@mit.edu
      Terrascope (not student-run)	terrascope@mit.edu	Michelle Contos	mcontos1@mit.edu
      Civil and Environmental Engineering Students Association (CEESA)	ceesa-exec@mit.edu	Catherine Lu	catlu@mit.edu
      Solar Electric Vehicle Team (SEVT)	gosolar@mit.edu	Lucy Young	lyoung24@mit.edu
      MIT Energy and Climate Club	mitec@mit.edu	Arina Khotimsky	arinadk@mit.edu
      MIT Water Club	waterclub-officers@mit.edu	Kristen Anna Riedinger	krieding@mit.edu
      Food Tech (formerly Cell Ag)	cell-ag-organizers@mit.edu	Megan Xu	meganxu@mit.edu
      MIT Sustainability Summit	sustainabilitysummit@mit.edu	Sandhya Mahadevan	sandhyam@mit.edu
      Engineers Without Borders	ewb-exec@mit.edu	Hung Huynh	hqh@mit.edu
      GSC Sustain	gsc-sustainability-chair@mit.edu	Amy Xiao	amyxiao@mit.edu
      MIT Food and Agriculture Club (MITFAC)	foodandag.officers@sloangroups.mit.edu
      Environmental Solutions Initiative (ESI)		Sarah Meyers	smeyers@mit.edu
      MIT Office of Sustainability (MITOS)		Brian Goldberg	bsgold@mit.edu
      MIT Energy Initiative (MITEI)		Rachel Shulman	rshulman@mit.edu
      MIT Climate and Sustainability Consortium (MCSC)		Elise Chambers	elisetch@mit.edu
      MIT Sloan Sustainability Initiative		Dominic Farrello	dfarello@mit.edu
      The Abdul Latif Jameel Water and Food Systems Lab (J-WAFS)		Carolyn Blais	cblais@mit.edu
      Climate Nucleus		Tom Kiley	tkiley@mit.edu
      Terrascope		Michelle Contos	mcontos1@mit.edu
      Center for Environmental and Energy Policy Research (CEEPR)		Chris Knittel	knittel@mit.edu
      MIT PKG Center		Lia Valdez	lvaldez@mit.edu
      MIT Climate Portal		Aaron Krol	akrol@mit.edu

      You will use the above table to answer questions about sustainability orgs at MIT.`,
    },
  ];
  messages.push(...body?.messages);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};
export default handler;
