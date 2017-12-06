<!doctype html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<title><?php echo _('Imprimir') ?></title>
	<link rel="stylesheet" href="<?php echo asset('/printable/css/bootstrap.css'); ?>" type="text/css" media="all">
	<link rel="stylesheet" href="<?php echo asset('/printable/css/bootstrap-theme.css'); ?>" type="text/css" media="all">
	<link rel="stylesheet" href="<?php echo asset('/printable/css/printweb.css'); ?>" type="text/css" media="screen">
	<link rel="stylesheet" href="<?php echo asset('/printable/css/printlayout.css'); ?>" type="text/css" media="print">
	<!--<link rel="stylesheet" href="--><?php //echo asset('/printable/css/landscape.css'); ?><!--" type="text/css" media="print">-->
	<link rel="stylesheet" href="<?php echo asset('/printable/css/styles.css'); ?>" type="text/css" media="all">
	<style>
		table.twin-table tr td, table.twin-table tr th
		{
			padding: 5px !important;
			margin: 0 !important;
		}
		table.small-padding tr td, table.small-padding tr th
		{
			padding: 5px !important;
			margin: 0 !important;
		}
		table.transport-table
		{
			margin: 0 auto;
			width: auto;
			font-size: 12px;
		}
		table.transport-table, table.transport-table tr, table.transport-table tr td
		{
			border: 1px solid #000000;
		}
		table.transport-table tr
		{
			height: 50px;
		}
		table.transport-table tr td, table.transport-table tr th
		{
			width: 100px;
			height: 50px;
			vertical-align: middle;
			text-align: center;
			margin: 0;
			padding: 0;
			line-break: normal;
		}
		table.transport-table tr td span.client-name
		{
			font-size: 11px;
		}
		table.transport-table tr td strong.seat-info
		{
			font-size: 11px;
		}
		table.transport-table tr td.cell-deshabilitado
		{
			border: none !important;
		}
		table.transport-table tr td.cell-asiento.used
		{
			background-color: #95a5a6 !important;
		}
		table.transport-table tr td.cell-especial.used
		{
			background-color: #e74c3c !important;
		}
		@media print
		{
			body {
				-webkit-print-color-adjust: exact !important;
			}
			table td, table th, table tr
			{
				-webkit-print-color-adjust: exact;
			}
			table.transport-table tr td.cell-asiento.used
			{
				background-color: #95a5a6 !important;
			}
			table.transport-table tr td.cell-especial.used
			{
				background-color: #e74c3c !important;
			}
		}
	</style>
</head>
<body>
<!-- Fixed navbar -->
<nav class="navbar navbar-default navbar-fixed-top no-print">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
			        aria-expanded="false" aria-controls="navbar">
				<span class="sr-only"><?php echo _('Ocultar'); ?></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="<?php echo site_url('corridas/consultar/'.$dato->id) ?>">
				<?php _e('Corrida: %s', array( ucwords( mb_strtolower( $dato->nombre, 'UTF-8' ) ) ) ); ?>
			</a>
		</div>
		<div id="navbar" class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<li>
					<p class="navbar-btn">
						<a href="<?php echo site_url('corridas/consultar/'.$dato->id) ?>" class="btn btn-default"><?php echo _("Volver")?></a>
					</p>
				</li>
				<li style="margin-left: 10px;">
					<p class="navbar-btn">
						<a id="print-button" href="#" class="btn btn-danger"><?php echo _("Imprimir") ?></a>
					</p>
				</li>
			</ul>
		</div>
	</div>
</nav>
<div class="print-container">
	<div class="print-page">
		<div class="print-block">
			<div class="clearfix">

				<div class="text-center">
					<h3>
						<?php echo $dato->nombre ?> <br>
                        <?php if (!empty($dato->nombre_vehiculo) || !empty($dato->placas)) : ?>
                        <small>( <?= !empty($dato->nombre_vehiculo) ? $dato->nombre_vehiculo.', ':'' ?><?= !empty($dato->placas) ? _('placas: ') . $dato->placas : '' ?> )</small>
                        <?php endif ?>
					</h3>
				</div>
                
				<div class="pull-left">
					<h3>
						<?php
						if( is_array( $hotel ) ) {
							_e('Hoteles: ');
						}
						?>
					</h3>
					<div>
						<?php
						foreach($hotel as $h) {
							?>
							<i>
								<?php
								echo ucwords( mb_strtolower( $h->nombre, 'UTF-8' ) ).'<br>';
								?>
							</i>
							<?php
						}
						?>
					</div>
                    <?php if (!empty($dato->nombre_chofer)) : ?>
                    <div style="margin-top: 10px;">
                        <strong><?= _('Nombre del Chofer:') ?></strong> <?= $dato->nombre_chofer ?>
                    </div>
                    <?php endif ?>
				</div>

				<h5 class="pull-right text-right">
					<?php _e('Fecha de salida: '.human_date( $dato->salida )) ?><br>
					<?php _e('Fecha de vuelta: '.( $dato->es_redonda ? human_date($dato->vuelta) : _('No aplica'))) ?>
				</h5>
			</div>
			<div class="new-line"></div>
			<div class="clearfix">
				<h5>
					<?php _e('La corrida tiene cupo de '.$dato->asientos.' asientos'); ?>
					<?php
					$asientos_ocupados = 0;
					foreach($dato->asientos_ocupados AS $asiento) {
						$asientos_ocupados += $asiento->asientos;
					}
					?>
					<span class="pull-right"><?php _e('Hay '.$asientos_ocupados.' asientos registrados actualmente'); ?></span>
				</h5>
			</div>
			<div class="new-line"></div>
			<?php
			$pasajeros_por_hotel = array();
			if ($asientos && is_array($asientos)) :
				$asientos_aux = $asientos;
				foreach($asientos_aux as &$asiento) :
					$asiento->hotel = json_decode($asiento->hotel);
					if (is_object($asiento->hotel) && isset($asiento->hotel->id)) {
						$pasajeros_por_hotel[$asiento->hotel->id]['pasajeros'][] = $asiento;
						$pasajeros_por_hotel[$asiento->hotel->id]['hotel'] = $asiento->hotel;
					}
					else {
						$pasajeros_por_hotel[-1]['pasajeros'][] = $asiento;
					}
				endforeach;
			endif;
			foreach($pasajeros_por_hotel as $pasajero) :
				?>
				<div class="print-block">
					<div>
						<h2>
							<?php
							if (isset($pasajero['hotel']) && is_object($pasajero['hotel'])) {
								echo $pasajero['hotel']->nombre.' <small>('.count($pasajero['pasajeros']).')</small>';
							}
							else {
								echo _('Sin destino específico');
							}
							?>
						</h2>
					</div>
					<table class="table table-striped small-padding" style="font-size: 11px">
						<thead>
						<tr>
							<th><?php _e('#') ?></th>
							<th><?php _e('Pasajero') ?></th>
							<th class="text-center"><?php _e('Celular') ?></th>
							<th class="text-center"><?php _e('Asiento') ?></th>
							<th style="width: 200px"><?php _e('Hotel Destino') ?></th>
						</tr>
						</thead>
						<tbody>
						<?php
						$grupos_listados = array();
						if ($pasajero['pasajeros'] && is_array($pasajero['pasajeros'])) :
							$count = 0;
							foreach($pasajero['pasajeros'] as $asiento) :
								?>
								<tr>
									<td><?php echo ++$count ?></td>
									<td><?php echo $asiento->nombre_cliente ?></td>
									<td class="text-center">
										<?php
										if (!in_array($asiento->grupo_asientos, $grupos_listados)) {
											array_push($grupos_listados, $asiento->grupo_asientos);
											echo $asiento->telefono;
										}
										?>
									</td>
									<td class="text-center"><?php echo strtoupper(str_replace('_', '', $asiento->casilla_nombre)) ?></td>
									<td><?php echo is_object($asiento->hotel) && isset($asiento->hotel->nombre) ? $asiento->hotel->nombre : '---' ?></td>
								</tr>
								<?php
							endforeach;
						endif;
						?>
						</tbody>
					</table>
				</div>
				<div class="clearfix"></div>
				<?php
			endforeach;
			if (is_array($pasajeros_por_hotel) && count($pasajeros_por_hotel) <= 0) :
				?>
				<div class="print-block">
					<table class="table table-striped">
						<tbody>
						<tr>
							<td class="text-center">
								<?php _e('No existen pasajeros registrados actualmente') ?>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<?php
			endif;
			?>
			<div class="clearfix"></div>
		</div>
	</div>
	<?php
	if (isset($transporte) && is_object($transporte)) :
		?>
		<div class="print-page">
			<div class="print-block">
				<h2 class="text-center">
					<?php
					_e('Disposición');
					if (isset($transporte) && is_object($transporte) && isset($transporte->nombre)) :
					?>
					<br>
					<small>( <?php echo $transporte->nombre ?> )</small>
					<?php
					endif;
					?>
				</h2>
			</div>
			<div class="new-line"></div>
			<table class="table transport-table">
				<?php
				$pasajeros = array();
				if (isset($asientos) && $asientos && is_array($asientos)) :
					$count = 0;
					foreach($asientos as $asiento) :
						$pasajeros[strtoupper(str_replace('_', '', $asiento->casilla_nombre))] = $asiento;
					endforeach;
				endif;
				$casillas = array();
				foreach($transporte->casillas as $casilla) {
					$casillas[strtoupper(str_replace('_', '', $casilla->position))] = $casilla;
				}
				$alphabet   = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
				$control_alphabet = 0;
				$numero_asiento = 0;
				$numero_asiento_especial = 0;
				for($i = 0; $i < $transporte->rows; $i++) {
					?>
					<tr>
						<?php
						for($j = 0; $j < $transporte->cols; $j++) {
							$position = $alphabet[$i].($j+1);
							if (isset($casillas[$position])) :
								?>
								<td class="text-center cell-<?php echo $casillas[$position]->status.' '.(isset($pasajeros[$position]) ? 'used' : '') ?>">
									<?php
									if (isset($pasajeros[$position])) :
										?>
										<span class="client-name">
									<?php
									echo $pasajeros[$position]->nombre_cliente;
									?>
										</span>
										<br>
										<?php
									endif;
									?>
									<strong class="seat-info">
										<?php
										switch ($casillas[$position]->status) {
											case 'asiento':
												echo 'A'.(++$numero_asiento);
												break;
											case 'especial':
												echo 'ESP'.(++$numero_asiento_especial);
												break;
											case 'pasillo':
												?>
												<i>
													<?php
													echo 'P';
													?>
												</i>
												<?php
												break;
											case 'conductor':
												?>
												<i>
													<?php
													echo _('C');
													?>
												</i>
												<?php
												break;
											case 'baño':
												?>
												<i>
													<?php
													echo _('B');
													?>
												</i>
												<?php
												break;
											case 'puerta':
												?>
												<i>
													<?php
													echo _('PUERTA');
													?>
												</i>
												<?php
												break;
										}
										?>
									</strong>
								</td>
								<?php
							else :
								?>
								<td></td>
								<?php
							endif;
						}
						?>
					</tr>
					<?php
				}
				?>
			</table>
		</div>
		<?php
	endif;
	?>
</div>
<script src="<?php echo asset('/printable/js/jquery-2.2.2.min.js'); ?>"></script>
<script src="<?php echo asset('/printable/js/printable.js'); ?>"></script>
</body>
</html>