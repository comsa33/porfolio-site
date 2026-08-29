import type { Project } from '@/types';

const project = {
  id: 'culturefit-matching',
  title: {
    ko: '컬쳐핏 매칭 ML 모델 (등록특허)',
    en: 'Culture-Fit Matching ML Model (Patented)',
  },
  shortDescription: {
    ko: '구직자와 기업의 조직문화 적합도를 예측하는 매칭 모델 — 등록특허 KR 10-2721044',
    en: 'Predicts culture fit between job seekers and companies — Korean Patent 10-2721044',
  },
  fullDescription: {
    ko: '그레이비랩 AI Lab.에서 구직자-구인기업 컬쳐핏 매칭 모델을 설계·학습했습니다. 200만 건 기업 리뷰 데이터를 비지도 클러스터링으로 조직문화 유형으로 구조화하고, 사전학습 언어모델의 zero-shot 분류로 리뷰·채용공고 텍스트를 문화 축에 매핑했습니다. 이 방법은 「기계학습을 이용한 구직자-구인자 컬쳐핏 매칭 방법」으로 특허 등록되었습니다.',
    en: 'Designed and trained a job seeker–company culture-fit matching model at GravyLab AI Lab. Two million company reviews were structured into organizational-culture types via unsupervised clustering, and review and job-posting text was mapped onto culture axes with zero-shot classification by a pretrained language model. The method was granted a Korean patent.',
  },
  techStack: ['Python', 'Unsupervised Clustering', 'Pretrained LM (zero-shot)', 'Data Pipeline'],
  keyAchievements: [
    {
      ko: '기업 리뷰 200만 건 비지도 클러스터링으로 조직문화 유형 도출',
      en: 'Derived organizational-culture types by clustering 2M company reviews (unsupervised)',
    },
    {
      ko: '사전학습 언어모델 zero-shot 분류로 리뷰·채용공고 텍스트를 문화 축에 매핑',
      en: 'Mapped review and job-posting text onto culture axes via zero-shot classification',
    },
    {
      ko: '등록특허 KR 10-2721044 「기계학습을 이용한 구직자-구인자 컬쳐핏 매칭 방법」 — 공동발명자 4인 중 1인, 2024.10 등록',
      en: 'Korean Patent 10-2721044, “Culture-fit matching method between job seekers and employers using machine learning” — one of four co-inventors, registered Oct 2024',
    },
    {
      ko: '학습 데이터 수집용 대규모 웹크롤러·데이터 파이프라인 구축',
      en: 'Built large-scale web crawlers and data pipelines for training-data collection',
    },
  ],
  features: [
    'Culture-Fit Matching',
    'Unsupervised Clustering',
    'Zero-shot Classification',
    'Registered Patent',
  ],
  company: {
    ko: '(주)그레이비랩',
    en: 'GravyLab Inc.',
  },
  period: {
    ko: '2022.05 ~ 2023.06',
    en: 'May 2022 ~ Jun 2023',
  },
  featured: false,
  order: 7,
  scope: 'company',
} satisfies Project;

export default project;
