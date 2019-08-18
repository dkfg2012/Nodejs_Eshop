<?php 
	

	if(isset($_POST['submit'])){
		require "../index.php";

		$username = $_POST['username'];
		$password = $_POST['password'];
		$repasswd = $_POST['pwd-repeat'];

		if(empty($username)||empty($password)||empty($repasswd)){
			header("Location: ./login.php?error=emptyfields&username=".$username);
			exit();
		}else if($password !== $repasswd){
			header("Location: ./login.php?error=passwordcheck&username=".$username);
			exit();
		}else{
			$conn = new sqlConnect();
			$query = "SELECT user_password FROM users WHERE user_name = '$username'";
			$db_passwd = $conn->execute($query);
			$db_passwd = $db_passwd[0]['user_password'];
			if($password === $db_passwd){
				session_start();
				$_SESSION['user_login'] = 1;
				if(isset($_COOKIE['user']) && unserialize($_COOKIE['user'])['username'] == $username){

				}else{
					$data = array('user_login'=>true, 'username'=>$username, 'cart' => array());
					setcookie('user' ,serialize($data),time()+1000, '/');
				}
				echo "login success";
				echo "<p>jumping in 3 second</p>";
				header("refresh:3;URL= ../main/main.php");
				exit();
			}else{
				echo "fail to login";
				header('refresh: 3;URL=../main/main.php');
			}
		}


	}
 ?>