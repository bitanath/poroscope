export default function ClashCard() {
  return (
    <div className="bg-white w-[300px] inline-block mx-auto rounded-2xl  relative text-center bg-[radial-gradient(circle,#0891b2_0%,#ffffff_100%)] shadow-[0_15px_30px_-12px_black] z-9999">
      <div 
        className="relative h-[230px] mb-[35px] rounded-t-[14px] border border-gray-200 rounded-xl bg-cover bg-center"
      >
        <img 
          src="/Graves.png" 
          alt="barbarian"
          className="w-[480px] object-cover absolute -top-[20px] block scale-125"
        />
      </div>
      
      <div className="clash-card__level clash-card__level--barbarian text-gray-800">Level 4</div>
      <div className="clash-card__unit-name text-gray-500">The Barbarian</div>
      <div className="clash-card__unit-description text-gray-300">
        Terimaki
      </div>
    </div>
  );
}
