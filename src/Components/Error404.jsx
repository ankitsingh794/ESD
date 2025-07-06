import TrueFocus from "./TrueFocus";

export default function Error404() {
    return (
        <div className="error-404">
            <TrueFocus
                sentence="The Page is Under Construction , Please Come Back Later !!!"
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={1}
                pauseBetweenAnimations={0.3}
            />
        </div>
    );
}