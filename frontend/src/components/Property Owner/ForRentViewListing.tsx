import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/Property Owner/ForRentViewListing.css';

interface RentListingData {
    id: string;
    title: string;
    price: string;
    location: string;
    image: string;
    description: string;
    type: 'Rent';
    bedrooms: number;
    bathrooms: number;
    area: string;
    datePosted: string;
}

const MOCK_RENT_LISTINGS: Record<string, RentListingData> = {
    'rent-1': {
        id: 'rent-1',
        title: 'Shared Room Blue Area',
        price: 'PKR 15,000',
        location: 'Blue Area, Islamabad',
        image: '/assets/images/Securemessaging.jpg',
        description: 'Affordable shared accommodation available in the commercial hub of Blue Area. Ideal for working professionals and students. Utilities included in the rent.',
        type: 'Rent',
        bedrooms: 1,
        bathrooms: 1,
        area: 'Shared',
        datePosted: 'Jan 05, 2024'
    },
    'rent-2': {
        id: 'rent-2',
        title: 'Cozy Studio DHA',
        price: 'PKR 30,000',
        location: 'DHA Phase 5, Islamabad',
        image: '/assets/images/photo-1515263487990-61b07816b324 (flat).avif',
        description: 'A fully furnished cozy studio apartment perfect for singles or couples. Located in a secure and peaceful neighborhood of DHA. Close to parks and commercial areas.',
        type: 'Rent',
        bedrooms: 1,
        bathrooms: 1,
        area: '500 Sq. Ft.',
        datePosted: 'Dec 15, 2023'
    }
};

export const ForRentViewListing = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [listing, setListing] = useState<RentListingData | null>(null);

    useEffect(() => {
        if (id && MOCK_RENT_LISTINGS[id]) {
            setListing(MOCK_RENT_LISTINGS[id]);
        } else {
            setListing(MOCK_RENT_LISTINGS['rent-1']);
        }
    }, [id]);

    if (!listing) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="for-rent-content">
                <div className="back-button-container">
                    <button onClick={() => navigate(-1)} className="btn-standard d-flex align-items-center gap-2">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                </div>

                <div className="listing-detail-card">
                    <div className="listing-image-container">
                        <img src={listing.image} alt={listing.title} className="listing-detail-img" />
                        <span className="rent-badge">For Rent</span>
                    </div>

                    <div className="listing-info-body">
                        <div className="listing-header">
                            <div className="row">
                                <div className="col-md-8">
                                    <h1 className="detail-title">{listing.title}</h1>
                                    <div className="detail-location">
                                        <MapPin size={20} />
                                        {listing.location}
                                    </div>
                                </div>
                                <div className="col-md-4 price-container">
                                    <div className="detail-price">
                                        {listing.price}<span className="text-muted fs-4 fw-normal">/mo</span>
                                    </div>
                                    <span className="price-period">Monthly Rent</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-features mb-5">
                            <div className="feature-item">
                                <Bed className="mb-2" size={28} />
                                <div className="fw-bold">{listing.bedrooms}</div>
                                <div className="small text-muted">Bedrooms</div>
                            </div>
                            <div className="feature-item">
                                <Bath className="mb-2" size={28} />
                                <div className="fw-bold">{listing.bathrooms}</div>
                                <div className="small text-muted">Bathrooms</div>
                            </div>
                            <div className="feature-item">
                                <Square className="mb-2" size={28} />
                                <div className="fw-bold">{listing.area}</div>
                                <div className="small text-muted">Area</div>
                            </div>
                            <div className="feature-item">
                                <Calendar className="mb-2" size={28} />
                                <div className="fw-bold">{listing.datePosted}</div>
                                <div className="small text-muted">Date Posted</div>
                            </div>
                        </div>

                        <div className="detail-description">
                            <h3>Description</h3>
                            <p>{listing.description}</p>
                        </div>

                        <div className="mt-5 pt-4 border-top">
                            <button className="btn-prominent w-100 py-3 fs-5 shadow-sm">Contact Agent / Owner</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForRentViewListing;
