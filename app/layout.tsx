import './globals.css';
import type { FC, ReactNode } from 'react';

export const metadata = {
  title: 'チャット',
  description: 'ローカルモデルとのチャットデモ',
};

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => (
  <html lang="ja">
    <body className="bg-gray-50">{children}</body>
  </html>
);

export default RootLayout;
