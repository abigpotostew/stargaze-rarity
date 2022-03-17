type TraitValue = string | number | boolean | null;

interface ExtTrait {
    trait_type: string;
    value: TraitValue;
}

export {
    TraitValue, ExtTrait
}