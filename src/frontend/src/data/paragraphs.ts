export interface Paragraph {
  id: number;
  title: string;
  category:
    | "haryana-gk"
    | "india-history"
    | "story"
    | "vocabulary"
    | "covid-19"
    | "g20"
    | "transport"
    | "entertainment"
    | "nature"
    | "general";
  language: "Hindi" | "English";
  text: string;
}

export const paragraphs: Paragraph[] = [
  // ========== HARYANA GK ==========
  {
    id: 1,
    title: "Haryana - The Land of Milk and Honey",
    category: "haryana-gk",
    language: "English",
    text: "Haryana is a landlocked state in northern India, carved out of the erstwhile **Punjab** state on November 1, 1966. The state shares its capital **Chandigarh** with Punjab. Haryana is bordered by Punjab and Himachal Pradesh to the north, Uttarakhand and Uttar Pradesh to the east, Rajasthan to the south and west, and Delhi to the northeast. The state is often called the 'Granary of India' because of its significant contribution to food grain production. **Kurukshetra**, the sacred land where the epic battle of Mahabharata was fought, is located in Haryana. The state has produced many Olympic and Commonwealth Games medal winners in wrestling, boxing, and athletics. Famous wrestlers like **Sushil Kumar** and **Yogeshwar Dutt** belong to Haryana. The state animal is the blackbuck and the state bird is the black francolin. Haryana has a literacy rate of around 76 percent and has been making rapid strides in education and industrial development. The major cities include **Gurugram**, Faridabad, Hisar, Rohtak, Panipat, Ambala, and Karnal. The state is famous for its dairy products, and milk production here is among the highest in the country.",
  },
  {
    id: 2,
    title: "हरियाणा की संस्कृति और इतिहास",
    category: "haryana-gk",
    language: "Hindi",
    text: "हरियाणा भारत का एक उत्तरी राज्य है जो 1 नवंबर 1966 को पंजाब से अलग होकर बना था। **चंडीगढ़** हरियाणा और पंजाब दोनों राज्यों की संयुक्त राजधानी है। हरियाणा की प्रमुख नदियाँ यमुना, घग्गर और सरस्वती हैं। राज्य का क्षेत्रफल लगभग 44,212 वर्ग किलोमीटर है। **कुरुक्षेत्र** वह पवित्र भूमि है जहाँ महाभारत का युद्ध हुआ था। हरियाणा कृषि में अग्रणी राज्य है और इसे भारत का अन्न भंडार कहा जाता है। यहाँ की मुख्य फसलें गेहूँ, चावल, बाजरा और गन्ना हैं। हरियाणा के पहलवानों और खिलाड़ियों ने ओलम्पिक और राष्ट्रमंडल खेलों में देश का नाम रोशन किया है। **गुरुग्राम** और फरीदाबाद राज्य के प्रमुख औद्योगिक केंद्र हैं। हरियाणा का राज्य पशु कृष्णमृग है और राज्य पक्षी काला तीतर है। हरियाणा का लोक संगीत और नृत्य भी बहुत प्रसिद्ध है जिसमें रागिनी और सांग प्रमुख हैं। राज्य की साक्षरता दर लगभग 76 प्रतिशत है।",
  },
  {
    id: 3,
    title: "Haryana Agriculture and Economy",
    category: "haryana-gk",
    language: "English",
    text: "Haryana is one of the most prosperous states in India with a robust agricultural economy. The **Green Revolution** of the 1960s transformed the agricultural landscape of Haryana, making it one of the largest contributors to India's food grain basket. The state produces more than 60 percent of wheat and rice for the **Central Pool**. Besides agriculture, Haryana has developed a strong industrial base. **Manesar** and Gurugram are major automobile manufacturing hubs. The state is home to some of the largest automobile companies including Maruti Suzuki and Honda. Information technology sector has also grown significantly with many multinational companies setting up offices in Gurugram. The per capita income of Haryana is among the highest in India. The state government has been actively promoting entrepreneurship through various schemes. Haryana has also made significant investments in infrastructure development including roads, power, and water supply. The state's milk cooperative, **VITA**, is one of the largest dairy cooperatives in the country, contributing significantly to the white revolution. Haryana also excels in sports and the government provides substantial support to athletes through various scholarship programs.",
  },
  {
    id: 4,
    title: "हरियाणा के प्रमुख जिले और पर्यटन स्थल",
    category: "haryana-gk",
    language: "Hindi",
    text: "हरियाणा में कुल 22 जिले हैं। **पानीपत** को ऐतिहासिक दृष्टि से बहुत महत्वपूर्ण माना जाता है क्योंकि यहाँ तीन महत्वपूर्ण युद्ध लड़े गए थे। **अंबाला** रेलवे का एक महत्वपूर्ण जंक्शन है। **हिसार** इस्पात उद्योग के लिए जाना जाता है जहाँ हरियाणा स्टील और आयरन प्लांट स्थित हैं। **रोहतक** को हरियाणा का हृदय कहा जाता है और यहाँ महर्षि दयानंद विश्वविद्यालय स्थित है। **सुल्तानपुर राष्ट्रीय उद्यान** पक्षी प्रेमियों के लिए एक प्रमुख पर्यटन स्थल है। **मोरनी हिल्स** हरियाणा का एकमात्र हिल स्टेशन है जो पंचकूला जिले में स्थित है। **धौज झील** और **दमदमा झील** भी पर्यटकों में लोकप्रिय हैं। राज्य में कई महत्वपूर्ण धार्मिक स्थल भी हैं जैसे कुरुक्षेत्र का ब्रह्मसरोवर, पेहोवा का सरस्वती घाट और अंबाला का देवी मंदिर। हरियाणा सरकार पर्यटन को बढ़ावा देने के लिए विभिन्न योजनाएं चला रही है।",
  },

  // ========== INDIA HISTORY ==========
  {
    id: 5,
    title: "India's Independence Movement",
    category: "india-history",
    language: "English",
    text: "India's struggle for independence from British rule is one of the most remarkable chapters in world history. The movement spanned nearly a century, combining mass movements, non-violent resistance, and political negotiations. **Mahatma Gandhi**, often called the Father of the Nation, led the Indian National Congress in organizing nationwide campaigns including the **Non-Cooperation Movement** of 1920, the **Civil Disobedience Movement** of 1930, and the **Quit India Movement** of 1942. The **Salt March** or Dandi March of 1930 was a powerful act of civil disobedience where Gandhi walked 240 miles to the sea to make salt, defying British law. **Subhas Chandra Bose** formed the Indian National Army and sought foreign support to fight the British. **Bhagat Singh**, **Rajguru**, and **Sukhdev** gave their lives for the nation's freedom. The **Jallianwala Bagh massacre** of 1919 in Amritsar, where British troops fired on unarmed civilians, was a turning point that galvanized the independence movement. Finally, on **August 15, 1947**, India gained independence after 200 years of British rule. The first Prime Minister was **Jawaharlal Nehru**, who delivered the famous 'Tryst with Destiny' speech.",
  },
  {
    id: 6,
    title: "भारत का स्वतंत्रता संग्राम",
    category: "india-history",
    language: "Hindi",
    text: "भारत का स्वतंत्रता संग्राम विश्व इतिहास का एक गौरवशाली अध्याय है। **महात्मा गांधी** ने असहयोग आंदोलन, सविनय अवज्ञा आंदोलन और भारत छोड़ो आंदोलन जैसे महान आंदोलनों का नेतृत्व किया। **1930 में नमक सत्याग्रह** के दौरान गांधी जी ने दांडी मार्च किया जो स्वतंत्रता संग्राम का एक महत्वपूर्ण पड़ाव था। **भगत सिंह**, **सुखदेव** और **राजगुरु** ने देश की आजादी के लिए अपने प्राण न्यौछावर कर दिए। **1857 का विद्रोह** भारतीय स्वतंत्रता संग्राम की पहली बड़ी लड़ाई थी जिसे सिपाही विद्रोह भी कहते हैं। **सुभाष चंद्र बोस** ने आजाद हिंद फौज का गठन किया और उनका नारा 'तुम मुझे खून दो, मैं तुम्हें आजादी दूंगा' आज भी प्रेरणादायक है। **1919 में जलियांवाला बाग** हत्याकांड ने पूरे देश को झकझोर कर रख दिया था। अंततः 15 अगस्त 1947 को भारत स्वतंत्र हुआ और **पंडित जवाहरलाल नेहरू** देश के पहले प्रधानमंत्री बने।",
  },
  {
    id: 7,
    title: "Ancient India - Indus Valley and Vedic Civilization",
    category: "india-history",
    language: "English",
    text: "The history of India dates back to ancient times, with one of the world's oldest civilizations flourishing in the Indian subcontinent. The **Indus Valley Civilization**, also known as the Harappan Civilization, thrived around 2500 BCE along the banks of the Indus River. Major cities like **Mohenjo-daro** and **Harappa** were remarkably well-planned with advanced drainage systems, granaries, and public baths. The civilization had a system of writing that has not yet been fully deciphered. After the decline of the Indus Valley Civilization, the **Vedic Age** began around 1500 BCE when the Aryans migrated into the Indian subcontinent. The **Rigveda**, one of the oldest scriptures in the world, was composed during this period. The **Mahabharata** and **Ramayana** are two great epics from ancient India that continue to influence Indian culture and values. The **Maurya Empire** under **Chandragupta Maurya** and **Ashoka** was one of the largest empires of the ancient world. Emperor Ashoka embraced Buddhism after the **Kalinga War** and spread its teachings across Asia. The **Gupta Period** from 4th to 6th century CE is known as the Golden Age of India for its remarkable achievements in science, mathematics, and art.",
  },
  {
    id: 8,
    title: "भारत का मध्यकालीन इतिहास",
    category: "india-history",
    language: "Hindi",
    text: "भारत का मध्यकालीन इतिहास बहुत ही समृद्ध और विविध है। **दिल्ली सल्तनत** की स्थापना 1206 ई. में **कुतुबुद्दीन ऐबक** द्वारा की गई थी। **अलाउद्दीन खिलजी** ने बाजार नियंत्रण प्रणाली लागू की और अपने साम्राज्य का विस्तार किया। **मुगल साम्राज्य** की नींव **बाबर** ने 1526 में **पानीपत की पहली लड़ाई** में इब्राहीम लोदी को हराकर रखी। **अकबर** को महान मुगल सम्राट माना जाता है जिन्होंने हिंदू-मुस्लिम एकता को बढ़ावा दिया और दीन-ए-इलाही धर्म की स्थापना की। **शाहजहाँ** ने **ताजमहल** का निर्माण अपनी पत्नी मुमताज महल की याद में करवाया। **शिवाजी महाराज** ने मराठा साम्राज्य की स्थापना की और मुगलों के खिलाफ वीरतापूर्वक लड़े। **विजयनगर साम्राज्य** दक्षिण भारत का सबसे शक्तिशाली हिंदू साम्राज्य था जिसकी राजधानी हम्पी थी।",
  },

  // ========== STORIES ==========
  {
    id: 9,
    title: "The Honest Woodcutter",
    category: "story",
    language: "English",
    text: "Once upon a time, there lived a poor woodcutter named **Ramu** in a small village near a dense forest. Every day he would go to the forest, cut wood, and sell it in the market to feed his family. One afternoon, while chopping wood near a river, his old **iron axe** slipped and fell into the deep water. He sat by the river bank and began to cry. Suddenly, a beautiful fairy appeared from the river and asked him why he was crying. He explained that his axe had fallen into the river and he was very poor to buy a new one. The fairy dived into the water and came back with a **golden axe**. She asked if it was his. The woodcutter shook his head and said it was not his. She dived again and brought a **silver axe**. Again, the honest woodcutter refused, saying it was not his. Finally, she dived once more and brought his old iron axe. The woodcutter was delighted and said yes, that was his axe. The fairy was pleased by his honesty and gave him all three axes as a reward. The woodcutter went home rich but remained humble and honest throughout his life. This story teaches us that **honesty is the best policy** and those who are truthful are always rewarded.",
  },
  {
    id: 10,
    title: "एकता में शक्ति",
    category: "story",
    language: "Hindi",
    text: "एक बार एक किसान के चार पुत्र थे। वे चारों हमेशा आपस में झगड़ते रहते थे। किसान बहुत चिंतित था कि उसके बाद उसके बेटे एक-दूसरे से लड़ते रहेंगे। **मृत्यु के समय** किसान ने अपने चारों बेटों को बुलाया। उसने उन्हें लकड़ियों का एक बंडल दिया और कहा कि इसे तोड़कर दिखाओ। एक-एक करके सभी ने बहुत कोशिश की लेकिन कोई भी उस बंडल को नहीं तोड़ सका। फिर किसान ने बंडल खोला और एक-एक लकड़ी अलग-अलग दी। इस बार सभी ने आसानी से लकड़ी तोड़ ली। किसान ने कहा - **देखो बेटों**, जब तुम एक साथ हो तो कोई भी तुम्हें नहीं तोड़ सकता, लेकिन अगर तुम अलग-अलग रहे तो कमजोर हो जाओगे। बेटों को पिता की बात समझ आ गई। उन्होंने प्रण किया कि वे हमेशा मिलजुल कर रहेंगे। इस कहानी से हमें यह शिक्षा मिलती है कि **एकता में शक्ति होती है** और परिवार के सदस्यों को हमेशा एक-दूसरे का साथ देना चाहिए।",
  },
  {
    id: 11,
    title: "The Clever Rabbit",
    category: "story",
    language: "English",
    text: "In a forest, there lived a ferocious **lion** who terrorized all the animals. Every day, the lion would kill animals unnecessarily, even when he was not hungry. The animals decided to make a deal with the lion. They said that every day one animal would come to him willingly as his food, so he should stop hunting randomly. The lion agreed. One day, it was the turn of a small **rabbit**. The clever rabbit went very late to the lion. The angry lion demanded why he was late. The rabbit said he was delayed because another lion on the way had threatened him. The lion was furious and asked to be shown this other lion. The rabbit led the lion to a deep **well** and said that the other lion lived there. The lion looked into the well and saw his own **reflection**. Thinking it was another lion, he roared and jumped into the well. The foolish lion drowned and the forest was free from his terror. The moral of this story is that **wisdom is greater than strength**. A small and clever animal defeated a powerful but foolish lion through intelligence and quick thinking.",
  },
  {
    id: 12,
    title: "मेहनत का फल",
    category: "story",
    language: "Hindi",
    text: "एक छोटे से गाँव में **रमेश** नाम का एक लड़का रहता था। वह बहुत गरीब था लेकिन पढ़ने में बहुत होशियार था। उसके माता-पिता खेतों में काम करते थे। रमेश रात को तेल का दीपक जलाकर पढ़ाई करता था। उसके दोस्त उसका मजाक उड़ाते थे और कहते थे कि गरीब बच्चे बड़े अधिकारी नहीं बन सकते। लेकिन रमेश ने हार नहीं मानी। उसने **कड़ी मेहनत** की और हर परीक्षा में अव्वल आया। उसे सरकारी छात्रवृत्ति मिली और उसने शहर के बड़े कॉलेज में प्रवेश लिया। वर्षों की मेहनत के बाद रमेश ने **आईएएस परीक्षा** उत्तीर्ण की और जिला अधिकारी बन गया। उसने अपने गाँव में स्कूल और अस्पताल बनवाए। जो लोग उसका मजाक उड़ाते थे वे अब उसकी प्रशंसा करते थे। इस कहानी से सीख मिलती है कि **मेहनत और लगन से कोई भी लक्ष्य प्राप्त किया जा सकता है।**",
  },

  // ========== VOCABULARY ==========
  {
    id: 13,
    title: "Important English Vocabulary for Competitive Exams",
    category: "vocabulary",
    language: "English",
    text: "Building a strong vocabulary is essential for success in competitive examinations. **Ambiguous** means open to more than one interpretation or having a double meaning. **Benevolent** refers to someone who is kind and generous, wishing good to others. **Cogent** means clear, logical, and convincing. **Diligent** describes someone who is hardworking and careful. **Eloquent** means fluent and persuasive in speaking or writing. **Frugal** refers to being economical with money or resources. **Gregarious** describes someone who is sociable and likes being with people. **Hostile** means unfriendly or opposed to something. **Immaculate** means perfectly clean or without any flaw. **Jubilant** means feeling great happiness and triumph. **Knowledgeable** refers to being intelligent and well-informed. **Lucid** means expressed clearly and easy to understand. **Meticulous** means showing great attention to detail and care. **Nonchalant** means appearing calm and not worried. **Obsolete** refers to something no longer in use or out of date. These vocabulary words frequently appear in government examinations like **SSC**, **Banking**, and **Railways** and should be practiced daily for effective preparation.",
  },
  {
    id: 14,
    title: "हिंदी शब्द भंडार और मुहावरे",
    category: "vocabulary",
    language: "Hindi",
    text: "प्रतियोगी परीक्षाओं में हिंदी शब्द भंडार का बहुत महत्व है। **अभिलाषा** का अर्थ है इच्छा या चाहत। **बाधा** का अर्थ है रुकावट या अवरोध। **परिश्रम** का अर्थ है कड़ी मेहनत। **सहयोग** का अर्थ है मिलकर काम करना। **विनम्रता** का अर्थ है नम्र और शालीन होना। कुछ महत्वपूर्ण मुहावरे भी जानने चाहिए जैसे - **'अक्ल पर पत्थर पड़ना'** यानी बुद्धि काम न करना। **'आग बबूला होना'** यानी बहुत गुस्सा होना। **'घड़ों पानी पड़ना'** यानी बहुत शर्म आना। **'दाल में काला होना'** यानी किसी बात में कुछ संदिग्ध होना। **'नौ दो ग्यारह होना'** यानी भाग जाना। **लोकोक्तियाँ** जैसे 'जैसी करनी वैसी भरनी', 'नीम हकीम खतरे जान', और 'आम के आम गुठलियों के दाम' भी परीक्षाओं में अक्सर पूछे जाते हैं। हिंदी व्याकरण में **संधि**, **समास**, **अलंकार** और **छंद** का ज्ञान भी जरूरी है।",
  },

  // ========== COVID-19 ==========
  {
    id: 15,
    title: "COVID-19 Pandemic and India's Response",
    category: "covid-19",
    language: "English",
    text: "The **COVID-19 pandemic** caused by the SARS-CoV-2 virus was declared a global pandemic by the **World Health Organization** on March 11, 2020. India reported its first COVID-19 case in **Kerala** in January 2020. The Indian government took swift action by implementing a nationwide **lockdown** on March 25, 2020, which was one of the strictest lockdowns in the world. During this period, essential services were maintained while people were asked to stay at home to prevent the spread of the virus. India launched the world's largest **vaccination drive** on January 16, 2021. The **Covishield** vaccine developed by Oxford-AstraZeneca and manufactured by the Serum Institute of India, and **Covaxin** developed indigenously by Bharat Biotech, were the primary vaccines used. India also supplied vaccines to many countries under the **Vaccine Maitri** initiative. The **Aarogya Setu** app was launched to help track the spread of infection. Doctors, nurses, healthcare workers, and police personnel were the frontline warriors who risked their lives to save others. The pandemic taught us the importance of hygiene, social distancing, wearing masks, and the value of medical science.",
  },
  {
    id: 16,
    title: "कोविड-19 और भारत",
    category: "covid-19",
    language: "Hindi",
    text: "**कोविड-19** एक वैश्विक महामारी थी जो **SARS-CoV-2 वायरस** के कारण फैली। **विश्व स्वास्थ्य संगठन** ने 11 मार्च 2020 को इसे महामारी घोषित किया। भारत में पहला मामला जनवरी 2020 में **केरल** में सामने आया। प्रधानमंत्री **नरेंद्र मोदी** ने 25 मार्च 2020 को देशव्यापी **लॉकडाउन** की घोषणा की। इस दौरान लोगों को घर के अंदर रहने की सलाह दी गई। भारत ने 16 जनवरी 2021 को विश्व का सबसे बड़ा **टीकाकरण अभियान** शुरू किया। **कोवैक्सीन** और **कोविशील्ड** दो मुख्य टीके थे। भारत ने **वैक्सीन मैत्री** कार्यक्रम के तहत कई देशों को टीके भेजे। **आरोग्य सेतु ऐप** संक्रमण की जानकारी देने के लिए बनाया गया था। डॉक्टर, नर्स और स्वास्थ्य कर्मचारी इस महामारी के **कोरोना योद्धा** बने। इस महामारी ने हमें हाथ धोने, मास्क पहनने और सोशल डिस्टेंसिंग का महत्व सिखाया।",
  },

  // ========== G20 ==========
  {
    id: 17,
    title: "India's G20 Presidency 2023",
    category: "g20",
    language: "English",
    text: "India assumed the **G20 Presidency** on December 1, 2022, for the period 2022-23. The theme chosen by India for its G20 Presidency was **'Vasudhaiva Kutumbakam'** — One Earth, One Family, One Future. This Sanskrit phrase from the Maha Upanishad reflects India's philosophy of universal brotherhood. The **G20 Summit** was held in **New Delhi** on September 9-10, 2023, at Bharat Mandapam. This was one of the most significant diplomatic events ever hosted by India. Under India's presidency, more than 200 meetings were held across various Indian cities, showcasing India's diversity and cultural heritage to the world. India achieved significant milestones during its presidency including the inclusion of the **African Union** as a permanent member of G20, making it G21. India also pushed for digital public infrastructure, climate financing, and sustainable development goals. **Prime Minister Modi** played a crucial role in bringing together world leaders on issues like debt restructuring, food security, and clean energy. India's G20 presidency was praised globally for its inclusive approach and the way it showcased India's soft power.",
  },
  {
    id: 18,
    title: "जी20 और भारत",
    category: "g20",
    language: "Hindi",
    text: "भारत ने 1 दिसंबर 2022 को **जी20** की अध्यक्षता ग्रहण की। भारत ने अपनी अध्यक्षता के लिए **'वसुधैव कुटुम्बकम्'** - एक पृथ्वी, एक परिवार, एक भविष्य का थीम चुना। यह संस्कृत का वाक्यांश महा उपनिषद से लिया गया है जो विश्व बंधुत्व का संदेश देता है। **जी20 शिखर सम्मेलन** 9-10 सितंबर 2023 को नई दिल्ली के भारत मंडपम में आयोजित हुआ। भारत की अध्यक्षता में 200 से अधिक बैठकें देश के विभिन्न शहरों में आयोजित की गईं। भारत की पहल पर **अफ्रीकी संघ** को जी20 का स्थायी सदस्य बनाया गया। **डिजिटल पब्लिक इंफ्रास्ट्रक्चर**, जलवायु वित्त और सतत विकास लक्ष्य भारत की प्राथमिकताएं थीं। **प्रधानमंत्री नरेंद्र मोदी** ने इस सम्मेलन में वैश्विक नेताओं को एकजुट करने में महत्वपूर्ण भूमिका निभाई। भारत की जी20 अध्यक्षता को विश्वभर में सराहना मिली।",
  },

  // ========== TRANSPORT ==========
  {
    id: 19,
    title: "India's New Trains and Metro Projects",
    category: "transport",
    language: "English",
    text: "India has been making rapid strides in modernizing its transportation infrastructure. The **Vande Bharat Express** is India's first semi-high speed train designed and manufactured entirely in India under the **Make in India** initiative. It can reach speeds of up to 160 km/h and features modern amenities like automatic doors, GPS, bio-vacuum toilets, and onboard entertainment. The **Namo Bharat** train (previously known as Rapid Rail) connects **Delhi** to **Meerut** and is India's first Regional Rapid Transit System. The **Bullet Train Project** between **Mumbai and Ahmedabad** is being developed with Japanese technology and will reduce travel time from 6 hours to just 2 hours. India's **Metro Rail** network has expanded significantly with cities like Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune, and Lucknow having operational metro systems. The **Kashi Mahakal Express** and **Tejas Express** are premium trains offering airline-like hospitality. The **Gatimaan Express** is the fastest train in India running between Delhi and Agra at 160 km/h. India Railways is also investing heavily in **electrification** of rail network and aiming to become carbon neutral by 2030.",
  },
  {
    id: 20,
    title: "भारत की नई ट्रेनें और मेट्रो",
    category: "transport",
    language: "Hindi",
    text: "भारत अपने परिवहन ढांचे को आधुनिक बनाने में तेजी से आगे बढ़ रहा है। **वंदे भारत एक्सप्रेस** भारत में बनी पहली सेमी-हाई स्पीड ट्रेन है जो 160 किमी प्रति घंटे की गति से चल सकती है। इसमें ऑटोमैटिक दरवाजे, जीपीएस, बायो-वैक्यूम टॉयलेट और ऑनबोर्ड एंटरटेनमेंट जैसी सुविधाएं हैं। **नमो भारत ट्रेन** दिल्ली से मेरठ को जोड़ती है और यह भारत की पहली रीजनल रैपिड ट्रांजिट सिस्टम है। **बुलेट ट्रेन परियोजना** मुंबई और अहमदाबाद के बीच जापानी तकनीक से बनाई जा रही है। भारत में **मेट्रो रेल** का नेटवर्क तेजी से बढ़ रहा है और दिल्ली, मुंबई, बेंगलुरू, चेन्नई, हैदराबाद, कोलकाता, पुणे और लखनऊ में मेट्रो चल रही है। **गतिमान एक्सप्रेस** दिल्ली से आगरा के बीच 160 किमी प्रति घंटे की रफ्तार से चलती है। भारतीय रेलवे 2030 तक कार्बन न्यूट्रल बनने का लक्ष्य लेकर चल रही है।",
  },

  // ========== ENTERTAINMENT ==========
  {
    id: 21,
    title: "Indian Cinema - Bollywood and Beyond",
    category: "entertainment",
    language: "English",
    text: "Indian cinema is the largest film industry in the world in terms of the number of films produced annually. **Bollywood**, the Hindi film industry based in **Mumbai**, is the most prominent and globally recognized segment. The history of Indian cinema dates back to 1913 when **Dadasaheb Phalke** made the first Indian feature film, **Raja Harishchandra**. Over the decades, legendary actors like **Raj Kapoor**, **Dilip Kumar**, **Dev Anand**, and **Amitabh Bachchan** ruled the silver screen. Modern superstars like **Shah Rukh Khan**, **Salman Khan**, and **Aamir Khan** have massive global fan followings. Regional cinema including Tamil, Telugu, Malayalam, Kannada, and Bengali films has also produced masterpieces recognized worldwide. Recently, **RRR** directed by **SS Rajamouli** won the **Academy Award** for Best Original Song, putting Indian cinema on the global map. **The Kashmir Files**, **Pathaan**, and **Animal** were among the biggest blockbusters of recent years. Indian music industry has also seen massive growth with artists like **Arijit Singh**, **Shreya Ghoshal**, and **AR Rahman** gaining international recognition. **AR Rahman** has won two **Academy Awards** for the film Slumdog Millionaire.",
  },
  {
    id: 22,
    title: "भारतीय सिनेमा और संगीत",
    category: "entertainment",
    language: "Hindi",
    text: "भारतीय सिनेमा विश्व का सबसे बड़ा फिल्म उद्योग है। **बॉलीवुड** मुंबई में स्थित हिंदी फिल्म उद्योग है जो विश्वभर में प्रसिद्ध है। भारतीय सिनेमा की शुरुआत 1913 में **दादासाहब फालके** की फिल्म **राजा हरिश्चंद्र** से हुई थी। **राज कपूर**, **दिलीप कुमार** और **देव आनंद** जैसे महान कलाकारों ने हिंदी सिनेमा को एक नई पहचान दी। **अमिताभ बच्चन** को बॉलीवुड का शहंशाह कहा जाता है। **शाहरुख खान**, **सलमान खान** और **आमिर खान** आज के दौर के सुपरस्टार हैं। तमिल, तेलुगु, मलयालम और कन्नड़ सिनेमा ने भी विश्वस्तर पर पहचान बनाई है। **एसएस राजामौली** की फिल्म **आरआरआर** ने ऑस्कर में बेस्ट ओरिजिनल सॉन्ग का अवार्ड जीता। **एआर रहमान** ने स्लमडॉग मिलेनियर के लिए दो **ऑस्कर पुरस्कार** जीते हैं। **अरिजीत सिंह** और **श्रेया घोषाल** भारतीय संगीत के शीर्ष कलाकार हैं।",
  },

  // ========== NATURE ==========
  {
    id: 23,
    title: "Fruits, Vegetables, and Their Benefits",
    category: "nature",
    language: "English",
    text: "India is one of the largest producers of fruits and vegetables in the world. **Mango**, the national fruit of India, is grown extensively in states like Uttar Pradesh, Andhra Pradesh, and Maharashtra. The famous varieties include **Alphonso**, **Dasheri**, **Langra**, and **Chaunsa**. **Banana** is the most widely consumed fruit in India and is rich in potassium and vitamin B6. **Papaya** is excellent for digestion and is grown throughout tropical India. Among vegetables, **tomato**, **potato**, and **onion** are the most important crops forming the backbone of Indian cuisine. **Spinach** is rich in iron and vitamins while **brinjal** is used in many traditional Indian recipes. **Bitter gourd** has medicinal properties and helps control blood sugar levels. **Amla** or Indian gooseberry is the richest natural source of Vitamin C. **Turmeric**, used extensively in Indian cooking, has powerful anti-inflammatory and antioxidant properties. India is also famous for its **spices** like cardamom, black pepper, cloves, and cinnamon. The colors of India's diverse fruits and vegetables - red apples, yellow bananas, orange carrots, green peas, purple eggplant, and white radish - make Indian markets a vibrant spectacle.",
  },
  {
    id: 24,
    title: "फल, सब्जियाँ और रंग",
    category: "nature",
    language: "Hindi",
    text: "भारत विश्व के सबसे बड़े फल और सब्जी उत्पादक देशों में से एक है। **आम** भारत का राष्ट्रीय फल है और इसकी अनेक प्रजातियाँ जैसे **अल्फांसो**, **दशहरी**, **लंगड़ा** और **चौसा** बहुत प्रसिद्ध हैं। **केला** पोटेशियम और विटामिन बी6 से भरपूर होता है। **पपीता** पाचन के लिए उत्तम है। **टमाटर**, **आलू** और **प्याज** भारतीय रसोई की जान हैं। **पालक** में आयरन और विटामिन भरपूर होते हैं। **करेला** रक्त शर्करा को नियंत्रित करने में मदद करता है। **आंवला** विटामिन सी का सबसे प्राकृतिक स्रोत है। **हल्दी** में एंटी-इंफ्लेमेटरी गुण होते हैं। भारत में फलों और सब्जियों के रंग बहुत विविध हैं - **लाल** टमाटर, **पीला** आम, **नारंगी** गाजर, **हरा** धनिया, **सफेद** मूली, **बैंगनी** बैंगन और **भूरा** अदरक। ये रंग न केवल देखने में सुंदर लगते हैं बल्कि इनमें विभिन्न पोषक तत्व भी होते हैं।",
  },

  // ========== GENERAL ==========
  {
    id: 25,
    title: "Digital India Initiative",
    category: "general",
    language: "English",
    text: "**Digital India** is a flagship programme of the Government of India, launched on July 1, 2015, with the vision to transform India into a digitally empowered society and knowledge economy. The programme focuses on three key areas: digital infrastructure as a core utility, governance and services on demand, and digital empowerment of citizens. **Aadhaar**, the world's largest biometric identification system, has been a cornerstone of Digital India. More than 1.3 billion Indians have been enrolled under Aadhaar. The **Unified Payments Interface** (**UPI**) has revolutionized digital payments in India, with billions of transactions happening monthly. India leads the world in real-time digital payments. **DigiLocker** allows citizens to store and access important documents digitally. **CoWIN** platform was used to manage the world's largest COVID-19 vaccination drive. The **BharatNet** project aims to provide broadband connectivity to all gram panchayats in India. **UMANG** app provides access to over 1200 government services on a single platform. India's IT sector contributes significantly to GDP and has made the country a global hub for technology services. The success of Digital India has inspired many developing countries to follow similar digital transformation paths.",
  },
  {
    id: 26,
    title: "डिजिटल इंडिया और तकनीकी विकास",
    category: "general",
    language: "Hindi",
    text: "**डिजिटल इंडिया** भारत सरकार का एक महत्वाकांक्षी कार्यक्रम है जिसे 1 जुलाई 2015 को शुरू किया गया था। इसका उद्देश्य भारत को एक डिजिटल रूप से सशक्त समाज और ज्ञान अर्थव्यवस्था में बदलना है। **आधार** दुनिया की सबसे बड़ी बायोमेट्रिक पहचान प्रणाली है जिसमें 130 करोड़ से अधिक भारतीय नागरिक नामांकित हैं। **यूपीआई** ने भारत में डिजिटल भुगतान में क्रांति ला दी है और भारत विश्व में रियल-टाइम डिजिटल पेमेंट में अग्रणी है। **डिजिलॉकर** के माध्यम से नागरिक अपने महत्वपूर्ण दस्तावेज डिजिटल रूप में रख सकते हैं। **भारतनेट** परियोजना सभी ग्राम पंचायतों को ब्रॉडबैंड से जोड़ने का लक्ष्य रखती है। **उमंग ऐप** पर एक हजार से अधिक सरकारी सेवाएं उपलब्ध हैं। भारत का आईटी क्षेत्र जीडीपी में महत्वपूर्ण योगदान देता है। **इसरो** के अंतरिक्ष मिशन जैसे **चंद्रयान** और **मंगलयान** ने भारत को विज्ञान और प्रौद्योगिकी में विश्वस्तर पर पहचान दिलाई है।",
  },
  {
    id: 27,
    title: "Indian Constitution and Democracy",
    category: "general",
    language: "English",
    text: "The **Constitution of India** is the supreme law of the land and came into effect on **January 26, 1950**, which is celebrated as **Republic Day**. It is the world's longest written constitution, originally consisting of 395 articles in 22 parts and 8 schedules. **Dr. B.R. Ambedkar** is known as the chief architect of the Indian Constitution and served as the chairman of the Drafting Committee. The Constitution declares India to be a **Sovereign, Socialist, Secular, Democratic Republic**. The words 'Socialist', 'Secular', and 'Integrity' were added to the Preamble by the **42nd Constitutional Amendment** in 1976. The Constitution guarantees **Fundamental Rights** to all citizens including Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, and Right to Constitutional Remedies. The **Directive Principles of State Policy** guide the state in making laws for the welfare of citizens. India has a **Parliamentary system** of government with the President as the constitutional head and the Prime Minister as the executive head. The **Supreme Court** is the guardian of the Constitution with the power of judicial review.",
  },
  {
    id: 28,
    title: "भारतीय संविधान और लोकतंत्र",
    category: "general",
    language: "Hindi",
    text: "**भारतीय संविधान** देश का सर्वोच्च कानून है जो **26 जनवरी 1950** को लागू हुआ। इस दिन को **गणतंत्र दिवस** के रूप में मनाया जाता है। यह विश्व का सबसे बड़ा लिखित संविधान है जिसमें मूल रूप से 395 अनुच्छेद, 22 भाग और 8 अनुसूचियाँ थीं। **डॉ. भीमराव आंबेडकर** संविधान के मुख्य निर्माता थे और प्रारूप समिति के अध्यक्ष थे। संविधान भारत को एक **संप्रभु, समाजवादी, धर्मनिरपेक्ष, लोकतांत्रिक गणराज्य** घोषित करता है। **मौलिक अधिकार** जैसे समानता का अधिकार, स्वतंत्रता का अधिकार और संवैधानिक उपचारों का अधिकार सभी नागरिकों को प्राप्त हैं। **नीति निदेशक तत्व** सरकार को नागरिकों के कल्याण के लिए कानून बनाने में मार्गदर्शन देते हैं। भारत में **संसदीय प्रणाली** है जिसमें राष्ट्रपति संवैधानिक प्रमुख और प्रधानमंत्री कार्यकारी प्रमुख होते हैं। **सर्वोच्च न्यायालय** संविधान का संरक्षक है।",
  },
  {
    id: 29,
    title: "Newspaper Reading - Current Affairs Importance",
    category: "general",
    language: "English",
    text: "Reading newspapers regularly is one of the most effective habits for competitive exam preparation. Newspapers like **The Hindu**, **The Times of India**, **Hindustan Times**, and **Indian Express** cover national and international current affairs comprehensively. For Hindi medium students, **Dainik Jagran**, **Amar Ujala**, **Hindustan**, and **Dainik Bhaskar** are excellent sources. Current affairs questions form a significant portion of examinations conducted by **UPSC**, **SSC**, **IBPS**, and **Railway Recruitment Boards**. Reading newspapers improves vocabulary, comprehension skills, and general awareness simultaneously. It is advisable to read the editorial section carefully as it helps develop analytical thinking and writing skills. Important sections to focus on include national news, international relations, economy, science and technology, sports, and awards and honors. Making notes of important events, appointments, government schemes, and sports achievements helps in quick revision. **PIB** (Press Information Bureau) releases are also important for government schemes and policies. Aspirants should also follow news related to state-specific events for state government examinations.",
  },
  {
    id: 30,
    title: "समाचार पत्र और करंट अफेयर्स",
    category: "general",
    language: "Hindi",
    text: "प्रतियोगी परीक्षाओं की तैयारी के लिए **समाचार पत्र** पढ़ना बहुत जरूरी है। **दैनिक जागरण**, **अमर उजाला**, **हिंदुस्तान** और **दैनिक भास्कर** हिंदी के प्रमुख अखबार हैं। **द हिंदू**, **टाइम्स ऑफ इंडिया** और **हिंदुस्तान टाइम्स** अंग्रेजी के प्रमुख अखबार हैं। **यूपीएससी**, **एसएससी**, **आईबीपीएस** और **रेलवे** की परीक्षाओं में करंट अफेयर्स से बहुत प्रश्न पूछे जाते हैं। समाचार पत्र पढ़ने से शब्द भंडार, बोध क्षमता और सामान्य ज्ञान एक साथ बढ़ता है। **संपादकीय** पढ़ने से विश्लेषण क्षमता और लेखन कौशल विकसित होता है। राष्ट्रीय-अंतर्राष्ट्रीय समाचार, अर्थव्यवस्था, विज्ञान-प्रौद्योगिकी, खेल और पुरस्कार जैसे विषयों पर ध्यान देना चाहिए। **पीआईबी** यानी प्रेस सूचना ब्यूरो सरकारी योजनाओं की जानकारी के लिए अच्छा स्रोत है। नोट्स बनाने की आदत करंट अफेयर्स को याद रखने में बहुत मददगार होती है।",
  },
  {
    id: 31,
    title: "Vehicles and Transportation in India",
    category: "nature",
    language: "English",
    text: "India has one of the largest road networks in the world with over 6 million kilometers of roads. The country manufactures a wide variety of vehicles including **motorcycles**, **scooters**, **cars**, **buses**, **trucks**, and **tractors**. **Maruti Suzuki** is the largest passenger car manufacturer in India, followed by **Hyundai**, **Tata Motors**, and **Mahindra**. India is the world's largest manufacturer of two-wheelers with brands like **Hero**, **Honda**, **TVS**, and **Bajaj** leading the market. **Electric vehicles** are gaining popularity with companies like **Tata**, **Ola Electric**, and **Ather** leading the segment. The **National Highways** connect major cities and towns across India with NH44 being the longest highway running from Srinagar to Kanyakumari. India's automobile industry contributes significantly to the GDP and provides employment to millions. The government has been promoting **EV adoption** through FAME India scheme. Public transport includes **buses**, **auto-rickshaws**, **taxis**, **metro rails**, and **local trains**. The **Ola** and **Uber** app-based cab services have revolutionized urban transportation. India's aviation sector has also grown with airlines like **IndiGo**, **Air India**, **SpiceJet**, and **Vistara** connecting hundreds of cities.",
  },
  {
    id: 32,
    title: "India's Major Sports Achievements",
    category: "general",
    language: "English",
    text: "India has achieved remarkable success in international sports over the past few decades. **Cricket** is the most popular sport in India and the country has won the **ICC Cricket World Cup** in 1983 under **Kapil Dev** and in 2011 under **MS Dhoni**. The **2024 T20 World Cup** was also won by India. **Sachin Tendulkar**, known as the 'God of Cricket', is the highest run scorer in Test and ODI cricket. In **Olympics**, **Neeraj Chopra** created history by winning the gold medal in **javelin throw** at the **Tokyo Olympics 2020**, making him the first Indian to win Olympic gold in athletics. **PV Sindhu** is a two-time Olympic medalist in badminton. **Bajrang Punia**, **Ravi Kumar Dahiya**, and **Vinesh Phogat** have won Olympic medals in wrestling. India performed exceptionally well at the **2023 Asian Games** in Hangzhou, China, winning 107 medals. The Indian government's **Khelo India** and **Target Olympic Podium Scheme** (**TOPS**) have helped in nurturing sporting talent. **Chess** has also seen India rise to the top with **Viswanathan Anand** being a five-time World Chess Champion and the country producing many grandmasters.",
  },
  {
    id: 33,
    title: "भारत की खेल उपलब्धियाँ",
    category: "general",
    language: "Hindi",
    text: "भारत ने पिछले कुछ दशकों में अंतर्राष्ट्रीय खेलों में उल्लेखनीय सफलता हासिल की है। **क्रिकेट** भारत का सबसे लोकप्रिय खेल है। **कपिल देव** की कप्तानी में 1983 और **एमएस धोनी** की कप्तानी में 2011 में भारत ने **क्रिकेट विश्व कप** जीता। **2024 टी20 विश्व कप** भी भारत ने जीता। **सचिन तेंदुलकर** को 'क्रिकेट का भगवान' कहा जाता है। **नीरज चोपड़ा** ने **टोक्यो ओलम्पिक 2020** में भाला फेंक में स्वर्ण पदक जीता जो किसी भारतीय एथलीट का पहला ओलम्पिक स्वर्ण था। **पीवी सिंधु** बैडमिंटन में दो बार ओलम्पिक पदक जीत चुकी हैं। **विश्वनाथन आनंद** पाँच बार विश्व शतरंज चैंपियन रहे हैं। **2023 एशियाई खेलों** में भारत ने 107 पदक जीते। सरकार की **खेलो इंडिया** और **टॉप्स** योजनाएं खिलाड़ियों के विकास में महत्वपूर्ण भूमिका निभा रही हैं।",
  },
];

export const getByCategory = (category: string) =>
  paragraphs.filter((p) => p.category === category);

export const getByLanguage = (language: string) =>
  paragraphs.filter((p) => p.language === language);

export const getByIdOrFirst = (id: number) =>
  paragraphs.find((p) => p.id === id) || paragraphs[0];
