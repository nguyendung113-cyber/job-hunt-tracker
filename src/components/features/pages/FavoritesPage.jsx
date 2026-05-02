import React from 'react';
import ApplicationList from '../ApplicationList';
import { Star } from 'lucide-react';
import './FavoritesPage.css';

const FavoritesPage = ({ userId }) => {
  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <Star size={24} fill="#f59e0b" color="#f59e0b" />
        <p>Danh sách các công việc bạn đã đánh dấu ưu tiên</p>
      </div>
      <ApplicationList userId={userId} filterFavorite={true} />
    </div>
  );
};

export default FavoritesPage;
