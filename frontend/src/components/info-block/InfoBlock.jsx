import './InfoBlock.css';

export function InfoBlock({title, iconSrc, data, additionalInfo}) {

    return (
        <div className='block'>
            <div className='title'>
                <img src={iconSrc} alt="icon" />
                <h4>{title}</h4>
            </div>
            <p className='data-text'>{data}</p>
            <p className='additionalInfo'>{additionalInfo}</p>
        </div>
    );

}

export function SunBlock({title, iconSrc, data, sunrise, sunset}) {

    return (
        <div className='block'>
            <div className='title'>
                <img src={iconSrc} alt="icon" />
                <h4>{title}</h4>
            </div>
            <p className='data-text'>{data}</p>
            <div className='sun-data'>
                <img src="/icons/Sunrise.png" alt="icon"/>
                <p className='additionalInfo'>{sunrise}</p>
            </div>
            <div className='sun-data'>
                <img src="/icons/Sunset.png" alt="icon"/>
                <p className='additionalInfo'>{sunset}</p>
            </div>

        </div>
    );

}