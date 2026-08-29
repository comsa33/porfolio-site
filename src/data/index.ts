import type { PortfolioData } from '@/types';
import { profile } from './profile';
import { timeline } from './timeline';
import { projects } from './projects';
import { publications } from './publications';

export const portfolioData: PortfolioData = { profile, timeline, projects, publications };
