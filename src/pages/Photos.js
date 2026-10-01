import React from 'react';
import './Photos.css';

function Photos() {
  const albums = [
    {
      id: 1,
      title: '2023 Summer Holiday Empowerment Programme Graduation, Ota',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_Summer_Holiday_Empowerment_Programme_Graduation_Ota/thumb/IMG_20230909_130321_064.jpg?bwg=1707501756',
    },
    {
      id: 2,
      title: "KC Smart Leaders' Club Engagement on February 3, 2024",
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/KC_Smart_Leaders_Club_Engagement_on_February_3_2024/Photos/thumb/IMG_20240203_131445_056.jpg?bwg=1707389582',
    },
    {
      id: 3,
      title: '2023 End of the Year Event @Egbeda Office',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_End_of_the_Year_Event_@Egbeda_Office/thumb/IMG_20231230_132600_413.jpg?bwg=1707391077',
    },
    {
      id: 4,
      title: 'Social Tuesday Clinic on 21 November, 2023',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/Social_Tuesday_Clinic_on_21_November_2023/thumb/IMG_20231121_163109_178.jpg?bwg=1707501118',
    },
    {
      id: 5,
      title: '2023 BACK TO SCHOOL Preparation',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_BACK_TO_SCHOOL_Preparation/thumb/IMG_20230905_100936_978.jpg?bwg=1707502106',
    },
    {
      id: 6,
      title: '2023 Summer Code Camp Graduation, Egbeda',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_Summer_Code_Camp_Graduation_Egbeda/thumb/IMG_20230902_115825_200.jpg?bwg=1707502375',
    },
    {
      id: 7,
      title: 'During The 2023 Code Camp Programme',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/During_The_2023_Code_Camp_Programme/thumb/IMG_20230804_095306_947.jpg?bwg=1707503009',
    },
    {
      id: 8,
      title: '2023 Summer Holiday Empowerment Programme, Ota',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_Summer_Holiday_Empowerment_Programme_Ota/thumb/IMG_20230822_130703_058.jpg?bwg=1707503468',
    },
    {
      id: 9,
      title: 'Classroom Test',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/thumb/umbrella.jpg?bwg=1716397771',
    },
  ];

  return (
    <div className="photos-page">

      {/* Banner */}
      <section className="photos-banner">
        <h1>Photos</h1>
        <p>Home / Media / Photos</p>
      </section>

      {/* Albums */}
      <section className="photos-section">
        <h2 className="photos-section-title">My Dream Connect Event Albums</h2>
        <div className="albums-grid">
          {albums.map(album => (
            <div className="album-card" key={album.id}>
              <div className="album-image">
                <img src={album.cover} alt={album.title} />
                <div className="album-overlay">
                  <span>View Album</span>
                </div>
              </div>
              <h4 className="album-title">{album.title}</h4>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Photos;