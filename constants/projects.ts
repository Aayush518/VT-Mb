import { Ionicons } from '@expo/vector-icons';

export interface ProjectFeature {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface Publication {
  title: string;
  conference: string;
  link: string;
  year: string;
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  gradient: string[];
  status: 'completed' | 'ongoing' | 'planned';
  longDescription: string;
  features: ProjectFeature[];
  techStack?: string[];
  publications?: Publication[];
  demoUrl?: string;
  githubUrl?: string;
  images?: string[];
  team?: string[];
  results?: string[];
}

export const RESEARCH_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'नेपाली अर्पाबेट सिस्टम',
    subtitle: 'Rule Based G2P for Nepali Language',
    icon: 'language',
    description: 'नेपाली भाषाको लागि नियम-आधारित ग्राफिम-टु-फोनिम रूपान्तरण प्रणाली',
    gradient: ['#2563EB', '#7C3AED'],
    status: 'completed',
    longDescription: `
      यो प्रणालीले नेपाली भाषाको लिपि र उच्चारणको बीचको सम्बन्धलाई नियम-आधारित तरिकाले व्याख्या गर्छ।
      
      मुख्य विशेषताहरू:
      • व्यञ्जन र स्वरको विस्तृत वर्गीकरण
      • हलन्त र संयुक्त अक्षरको विशेष प्रबन्ध
      • उच्चारण नियमहरूको व्यवस्थित संग्रह
      • सरल र छिटो कार्यान्वयन
    `,
    features: [
      {
        title: 'नियम-आधारित रूपान्तरण',
        description: 'व्याकरणिक नियमहरूमा आधारित स्वचालित रूपान्तरण',
        icon: 'git-branch'
      },
      {
        title: 'उच्च शुद्धता',
        description: '९८% भन्दा बढी शुद्धता दर',
        icon: 'checkmark-circle'
      },
    ],
    techStack: ['Python', 'Regular Expressions', 'Unicode', 'Phonetics'],
    publications: [
      {
        title: 'Rule Based Grapheme to Phoneme System for Nepali',
        conference: 'IEEE Conference on NLP',
        year: '2023',
        link: 'https://example.com/paper'
      }
    ],
    results: [
      '९८% शुद्धता दर',
      'सबै नेपाली वर्णमालाको समावेश',
      'छिटो प्रशोधन समय'
    ],
    team: [
      'डा. कृष्ण कार्की',
      'रमेश पौडेल',
      'सुजन श्रेष्ठ'
    ]
  },
  {
    id: 2,
    title: 'सिक्वेन्स-टु-सिक्वेन्स G2P',
    subtitle: 'SEQ-SEQ Approach for Nepali G2P',
    icon: 'git-network',
    description: 'नेपाली भाषाको लागि डिप लर्निङ आधारित G2P प्रणाली',
    gradient: ['#7C3AED', '#EC4899'],
    status: 'ongoing',
    longDescription: `नेपाली भाषाको लागि डिप लर्निङ आधारित G2P प्रणाली विकास`,
    features: [
      {
        title: 'डिप लर्निङ मोडेल',
        description: 'LSTM आधारित सिक्वेन्स-टु-सिक्वेन्स मोडेल',
        icon: 'brain'
      }
    ],
    techStack: ['PyTorch', 'TensorFlow', 'Python'],
    publications: [],
    team: ['कृष्ण कार्की', 'रमेश पौडेल'],
  },
  {
    id: 3,
    title: 'सब्जेक्टिभ नेपाली अर्पाबेट',
    subtitle: 'Subjective NepaliArpabet with TT2',
    icon: 'analytics',
    description: 'टीटी२ इन्फरेन्समा कडा परीक्षणसहित तयार पारिएको सब्जेक्टिभ नेपाली अर्पाबेट',
    gradient: ['#EC4899', '#EF4444'],
    status: 'completed',
    longDescription: `
      टीटी२ इन्फरेन्समा आधारित नेपाली अर्पाबेट प्रणाली जसले उच्च गुणस्तरको स्पीच सिन्थेसिस सम्भव बनाउँछ।

      विशेषताहरू:
      • मानक नेपाली उच्चारण
      • विभिन्न बोली-भाषाको समर्थन
      • उच्च गुणस्तरको आवाज उत्पादन
      • कम प्रशोधन समय
    `,
    features: [
      {
        title: 'मानक उच्चारण',
        description: 'शुद्ध नेपाली उच्चारणमा आधारित',
        icon: 'mic'
      },
      {
        title: 'बहु-भाषिक समर्थन',
        description: 'विभिन्न नेपाली बोलीहरूको समावेश',
        icon: 'globe'
      }
    ],
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'ESPnet'],
    publications: [
      {
        title: 'Subjective NepaliArpabet: A Phonetic System for TTS',
        conference: 'Speech Synthesis Workshop 2023',
        year: '2023',
        link: 'https://example.com/paper'
      }
    ],
    results: [
      'MOS स्कोर: 4.2/5',
      'प्रशोधन समय: 0.3s/वाक्य',
      'मेमोरी उपयोग: 2GB'
    ],
    team: [
      'डा. सुरेश श्रेष्ठ',
      'अनुप पौडेल',
      'सविता तामाङ'
    ]
  },
  {
    id: 4,
    title: 'नेपाली TTS एब्लेसन',
    subtitle: 'Multiple Ablations for Nepali TTS',
    icon: 'pulse',
    description: 'नेपाली टेक्स्ट-टु-स्पीच प्रणालीको विभिन्न एब्लेसन अध्ययन',
    gradient: ['#EF4444', '#F59E0B'],
    status: 'ongoing',
    longDescription: `
      नेपाली टेक्स्ट-टु-स्पीच प्रणालीको विभिन्न घटकहरूको प्रभाव अध्ययन।

      अध्ययन क्षेत्रहरू:
      • अर्पाबेट प्रणालीको प्रभाव
      • प्रोसोडी मोडेलको महत्व
      • डाटासेट साइजको असर
      • मोडेल आर्किटेक्चरको तुलना
    `,
    features: [
      {
        title: 'व्यापक परीक्षण',
        description: '१० भन्दा बढी मोडेल संरचनाहरूको तुलना',
        icon: 'bar-chart'
      },
      {
        title: 'मेट्रिक विश्लेषण',
        description: 'विभिन्न मूल्यांकन मेट्रिक्सको प्रयोग',
        icon: 'stats-chart'
      }
    ],
    techStack: ['PyTorch', 'ESPnet', 'Librosa', 'Pandas'],
    publications: [
      {
        title: 'Comprehensive Ablation Study of Nepali TTS Components',
        conference: 'INTERSPEECH 2023',
        year: '2023',
        link: 'https://example.com/paper'
      }
    ]
  },
  // ... add more projects
]; 