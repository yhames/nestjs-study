import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd(); // 프로젝트 루트 경로, current working directory
export const PUBLIC_FOLDER_NAME = 'public'; // 외부에서 접근 가능한 폴더명
export const POSTS_FOLDER_NAME = 'posts'; // 게시물 이미지가 저장되는 폴더명
export const TEMP_FOLDER_NAME = 'temp'; // 임시 폴더명

// 공개 폴더의 절대 경로
// /{project_path}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 포스트 이미지 폴더의 절대 경로
// /{project_path}/public/posts
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

// 포스트 이미지의 URL 경로
// /public/posts
export const POST_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  POSTS_FOLDER_NAME,
);

// 임시 폴더의 절대 경로
// /{project_path}/public/temp
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME);
