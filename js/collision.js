let collide = (s1, s2) => {

    let hit = false;

    let vetX = s2.centerX() - s1.centerX();
    let vetY = s2.centerY() - s1.centerY();

    let sumHalfWidth = s1.halfWidth() + s2.halfWidth();
    let sumHalfHeight = s1.halfHeight() + s2.halfHeight();

    if(Math.abs(vetX) <= sumHalfWidth  && Math.abs(vetY) <= sumHalfHeight){
        hit = true;
    }

    return hit;

};
