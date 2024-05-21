import styles from "./obstacle-tile.module.css";

export default function ObstacleTile() {
  return (
    <div className={styles.tile}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <path
          fill="currentColor"
          d="M1.407 1.407v252.9h252.9V1.407H1.407zM246.149 61.23H131.937V9.564h114.212v51.667zm-62.098 8.16v54.385H71.861V69.392h112.19zm-120.35 54.385H9.564V69.392h54.137v54.384zm60.075 8.16v54.388H9.564v-54.387h114.212zm60.275 62.546v51.664H71.861v-51.664h112.19zm-52.114-8.158v-54.387h114.212v54.387H131.937zm60.271-62.548V69.392h53.938v54.384h-53.938zM123.776 9.564v51.667H9.564V9.564h114.212zM9.564 194.482h54.137v51.664H9.564v-51.664zm182.644 51.667v-51.667h53.938v51.664h-53.938z"
        />
      </svg>
    </div>
  );
}
